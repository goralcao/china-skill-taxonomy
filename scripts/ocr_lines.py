#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ocr_lines.py —— 面向「教材目录页」的 OCR 行还原

为什么需要「行还原」
------------------
目录页是一行「序号 + 书名 + 点线 + 页码」的版面。tesseract 的纯文本输出
常把序号与书名切散（「1 大数的认识 2」→「加 。 大数的认识」），序号直接丢失。

PP-OCR 系列返回的是「文字块 + 四点多边形」，可以按 y 中心聚成视觉行、再按 x
排序拼接，从而还原整行，序号和页码都保住。

后端优先级
----------
1. rapidocr（rapidocr-onnxruntime）——PP-OCRv4 模型的 ONNX 版，识别效果与
   PaddleOCR 一致，但不依赖 paddle 运行时
2. paddle（paddleocr）—— 原生 Paddle，语义最贴近官方
3. tesseract —— 兜底，无依赖

本机踩坑记录：Xeon 6981E 上 paddlepaddle 2.6.2 在 SelfAttentionFusePass
抛 SIGILL，关 MKLDNN 也无效，故默认走 rapidocr。

对外接口
--------
  ocr_lines(path) -> list[str]    按视觉行聚合的文本
  has_toc(lines) -> bool          是否目录页
  backend_name() -> str           实际使用的后端
"""
import re
import subprocess

_ENGINE = None
_BACKEND = None


# ---------- 引擎初始化 ----------
def _init_engine():
    global _ENGINE
    if _ENGINE is not None:
        return _ENGINE
    # 1) rapidocr
    try:
        from rapidocr_onnxruntime import RapidOCR
        _ENGINE = ("rapidocr", RapidOCR())
        return _ENGINE
    except Exception:
        pass
    # 2) paddleocr
    try:
        from paddleocr import PaddleOCR
        _ENGINE = ("paddle", PaddleOCR(use_angle_cls=False, lang="ch",
                                       show_log=False, enable_mkldnn=False,
                                       use_gpu=False))
        return _ENGINE
    except Exception:
        pass
    _ENGINE = ("tesseract", None)
    return _ENGINE


def backend_name():
    name, _ = _init_engine()
    return name


# ---------- 取文字块 ----------
def _boxes_rapid(engine, path):
    res, _ = engine(path)
    out = []
    for item in (res or []):
        try:
            box, text, score = item[0], item[1], item[2]
        except Exception:
            continue
        if not text or (score is not None and float(score) < 0.5):
            continue
        ys = [p[1] for p in box]
        xs = [p[0] for p in box]
        out.append({"text": str(text).strip(), "x": min(xs),
                    "y": sum(ys) / len(ys), "h": max(ys) - min(ys)})
    return out


def _boxes_paddle(engine, path):
    res = engine.ocr(path, cls=False)
    if not res:
        return []
    page = res[0] if isinstance(res[0], list) else res
    out = []
    for item in (page or []):
        try:
            box, (text, score) = item[0], item[1]
        except Exception:
            continue
        if not text or (score is not None and float(score) < 0.5):
            continue
        ys = [p[1] for p in box]
        xs = [p[0] for p in box]
        out.append({"text": str(text).strip(), "x": min(xs),
                    "y": sum(ys) / len(ys), "h": max(ys) - min(ys)})
    return out


# ---------- 聚行 ----------
def _group_lines(boxes, y_tol_ratio=0.55):
    if not boxes:
        return []
    hs = sorted(b["h"] for b in boxes)
    med_h = hs[len(hs) // 2] or 30
    tol = med_h * y_tol_ratio
    boxes.sort(key=lambda b: b["y"])

    lines, cur = [], [boxes[0]]
    for b in boxes[1:]:
        if abs(b["y"] - cur[-1]["y"]) <= tol:
            cur.append(b)
        else:
            lines.append(cur)
            cur = [b]
    lines.append(cur)

    out = []
    for ln in lines:
        ln.sort(key=lambda b: b["x"])
        parts, prev_end = [], None
        for b in ln:
            if prev_end is not None and b["x"] - prev_end > med_h * 0.35:
                parts.append(" ")
            parts.append(b["text"])
            prev_end = b["x"] + len(b["text"]) * med_h * 0.5
        s = "".join(parts).strip()
        if s:
            out.append(s)
    return out


def _tess_lines(path):
    try:
        r = subprocess.run(["tesseract", path, "stdout", "-l", "chi_sim",
                            "--psm", "6"],
                           capture_output=True, text=True, timeout=300)
        return [l.strip() for l in r.stdout.split("\n") if l.strip()]
    except Exception:
        return []


# ---------- 对外 ----------
def ocr_lines(path):
    name, engine = _init_engine()
    if name == "rapidocr":
        return _group_lines(_boxes_rapid(engine, path))
    if name == "paddle":
        return _group_lines(_boxes_paddle(engine, path))
    return _tess_lines(path)


def _norm_ws(text):
    """去掉所有空白（含 CJK 空格 U+3000、不间断空格 U+00A0）。"""
    return "".join(ch for ch in (text or "") if not ch.isspace())


def has_toc(lines):
    """目录页判定。

    OCR 常把标题「目录」误认成「日录 / 百录 / 且录 / 目有」，且中间可能夹
    空格（「目 录」）。先彻底去空白，再对形近字做兼容。
    """
    flat = _norm_ws("".join(lines or [])).lower()
    # 目(U+76EE) 易误认成 日/百/且/自；录(U+5F55) 易误认成 有/寻
    markers = ("目录", "日录", "百录", "且录", "自录",
               "目有", "日有", "目寻", "有录", "contents")
    if any(m in flat for m in markers):
        return True
    # OCR 有时把「目录」整行吃成单个「目」（如数学 3b：首行社名 + 「目」）。
    # 目录页标题必在前几行，故只看前 3 个非空行内是否有独立「目」字。
    head = [_norm_ws(l) for l in (lines or []) if _norm_ws(l)][:3]
    return any(h in ("目", "目录", "日录", "目有") for h in head)


if __name__ == "__main__":
    import os
    import sys
    print("后端:", backend_name())
    for p in sys.argv[1:]:
        print(f"\n=== {os.path.basename(p)} ===")
        for ln in ocr_lines(p):
            print(ln)
