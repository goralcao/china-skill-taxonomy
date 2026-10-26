#!/usr/bin/env node
/**
 * 网络受限时用 GitHub Git Data API 推送。
 *
 * 背景：某些网络环境下 `git push` 的 pack 传输会被中途掐断
 * （GnuTLS recv error -110），但单个 REST 请求正常。
 * 这个脚本把「本地最后一个提交」逐文件上传成 blob，再拼 tree / commit、挪 ref，
 * 每次请求只有几十 KB 到几 MB，绕开大包传输。
 *
 * 用法：
 *   node scripts/push-via-api.mjs            # 推送 HEAD 相对 origin/main 的改动
 *   node scripts/push-via-api.mjs --dry-run  # 只列出变更，不上传
 *
 * 前提：本机 gh 已登录且有 contents:write 权限。
 * 注意：远程生成的 commit sha 与本地不同（tree 相同），推完需要
 *   git fetch origin && git reset --hard origin/main
 * 让本地历史与远程对齐。
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';

const dryRun = process.argv.includes('--dry-run');

const remote = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
const m = remote.match(/github\.com[:/]([^/]+)\/([^/.]+)/);
if (!m) {
  console.error(`无法从 origin 解析 owner/repo：${remote}`);
  process.exit(1);
}
const [, OWNER, REPO_NAME] = m;
const REPO = `${OWNER}/${REPO_NAME}`;
const TOKEN = process.env.GH_TOKEN || execSync('gh auth token').toString().trim();

const H = {
  Authorization: `Bearer ${TOKEN}`,
  Accept: 'application/vnd.github+json',
  'Content-Type': 'application/json',
};

async function api(path, method = 'GET', body) {
  const res = await fetch(`https://api.github.com/repos/${REPO}${path}`, {
    method, headers: H, body: body ? JSON.stringify(body) : undefined,
  });
  const txt = await res.text();
  let json;
  try { json = txt ? JSON.parse(txt) : null; } catch { json = { raw: txt }; }
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status} ${txt.slice(0, 300)}`);
  return json;
}

// 用 API 取远程 main，避免依赖 git fetch 的凭证配置
const baseSha = (await api('/git/ref/heads/main')).object.sha;
const headSha = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();

if (baseSha === headSha) {
  console.log('origin/main 与 HEAD 一致，无需推送');
  process.exit(0);
}

let hasLocalBase = true;
try {
  execSync(`git cat-file -e ${baseSha}^{commit}`, { stdio: 'ignore' });
} catch {
  hasLocalBase = false;
}

/**
 * 本地没有远程提交时（典型场景：上次是 API 推送的，git fetch 又被 TLS 掐断），
 * 直接拿远程 tree 和本地索引里的 blob sha 对比，按内容算差异，不依赖本地历史。
 */
let status;
let baseTreeSha;
if (hasLocalBase) {
  baseTreeSha = (await api(`/git/commits/${baseSha}`)).tree.sha;
  status = execSync(`git diff --name-status ${baseSha}..HEAD`, { encoding: 'utf8' })
    .trim().split('\n').filter(Boolean)
    .map(line => {
      const [st, ...rest] = line.split('\t');
      return { st: st[0], path: rest.join('\t') };
    });
} else {
  console.log(`本地没有 ${baseSha.slice(0, 7)} 的提交，改为按内容比对远程 tree`);
  const remoteTree = await api(`/git/trees/${baseSha}?recursive=1`);
  if (remoteTree.truncated) throw new Error('远程 tree 太大被截断，先 git fetch');
  baseTreeSha = remoteTree.sha;
  const remote = new Map(remoteTree.tree.filter(t => t.type === 'blob').map(t => [t.path, t.sha]));
  const local = new Map();
  for (const line of execSync('git ls-files -s', { encoding: 'utf8' }).trim().split('\n')) {
    const m = line.match(/^\d+ ([0-9a-f]+) \d+\t(.+)$/);
    if (m) local.set(m[2], m[1]);
  }
  status = [];
  for (const [p, sha] of local) {
    if (!remote.has(p)) status.push({ st: 'A', path: p });
    else if (remote.get(p) !== sha) status.push({ st: 'M', path: p });
    remote.delete(p);
  }
  for (const p of remote.keys()) status.push({ st: 'D', path: p });
}

const adds = status.filter(x => x.st === 'A').length;
const mods = status.filter(x => x.st === 'M').length;
const dels = status.filter(x => x.st === 'D').length;
console.log(`待推送 ${status.length} 个文件（新增 ${adds} / 修改 ${mods} / 删除 ${dels}）`);

if (dryRun) {
  status.forEach(({ st, path }) => console.log(`  ${st}  ${path}`));
  process.exit(0);
}

const entries = [];
for (const { st, path } of status) {
  if (st === 'D') {
    entries.push({ path, mode: '100644', type: 'blob', sha: null });
    console.log(`  [删除] ${path}`);
    continue;
  }
  const buf = fs.readFileSync(path);
  const mode = execSync(`git ls-files -s -- "${path}"`, { encoding: 'utf8' }).trim().split(' ')[0] || '100644';
  const blob = await api('/git/blobs', 'POST', { content: buf.toString('base64'), encoding: 'base64' });
  entries.push({ path, mode, type: 'blob', sha: blob.sha });
  console.log(`  [${(buf.length / 1024).toFixed(0)}KB] ${path}`);
}

const tree = await api('/git/trees', 'POST', { base_tree: baseTreeSha, tree: entries });
const message = execSync('git log -1 --format=%B', { encoding: 'utf8' }).trim();
const [an, ae, ad] = execSync(`git log -1 --format='%an|%ae|%aI'`, { encoding: 'utf8' }).trim().split('|');

const commit = await api('/git/commits', 'POST', {
  message,
  tree: tree.sha,
  parents: [baseSha],
  author: { name: an, email: ae, date: ad },
});
await api('/git/refs/heads/main', 'PATCH', { sha: commit.sha, force: false });

console.log(`\n已推送：${commit.sha.slice(0, 10)} → ${REPO}/main`);
console.log('本地对齐：git fetch origin && git reset --hard origin/main');
