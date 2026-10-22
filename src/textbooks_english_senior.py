# -*- coding: utf-8 -*-
"""高中英语教材版本（人教版，10~12 年级）。

口径说明：
- 人民教育出版社《普通高中教科书·英语》，必修第一/二/三册 + 选择性必修第一/二/三/四册共 7 册。
- 按学期编为 6 个册次：必修1（10a）、必修2+必修3（10b，合并）、选必1（11a）、选必2（11b）、选必3（12a）、选必4（12b）。
- 单元为现行人教版目录（单元名保留英文主题）；本项目仅记录册次与单元结构作为主题锚点，不转载教材正文。
"""

ENGLISH_SENIOR_VERSION = {
    "slug": "pep-english-senior",
    "name": "人教版高中英语（普通高中教科书·英语）",
    "subject": "英语",
    "gradeStart": 10,
    "note": "人民教育出版社。高中英语含必修 1~3 与选择性必修 1~4 共 7 册，按学期编为 6 个册次（10b 合并必修2与必修3）。单元为现行人教版目录，单元名保留英文主题。",
    "books": [
        ("10a", 10, "上", [
            "Unit 1 Teenage Life",
            "Unit 2 Travelling Around",
            "Unit 3 Sports and Fitness",
            "Unit 4 Natural Disasters",
            "Unit 5 Languages Around the World",
        ], []),
        ("10b", 10, "下", [
            "Unit 1 Cultural Heritage（必修2）",
            "Unit 2 Wildlife Protection（必修2）",
            "Unit 3 The Internet（必修2）",
            "Unit 4 History and Traditions（必修2）",
            "Unit 5 Music（必修2）",
            "Unit 1 Festivals and Celebrations（必修3）",
            "Unit 2 Morals and Virtues（必修3）",
            "Unit 3 Diverse Cultures（必修3）",
            "Unit 4 Space Exploration（必修3）",
            "Unit 5 The Value of Money（必修3）",
        ], []),
        ("11a", 11, "上", [
            "Unit 1 People of Achievement",
            "Unit 2 Looking into the Future",
            "Unit 3 Fascinating Parks",
            "Unit 4 Body Language",
            "Unit 5 Working the Land",
        ], []),
        ("11b", 11, "下", [
            "Unit 1 Science and Scientists",
            "Unit 2 Bridging Cultures",
            "Unit 3 Food and Culture",
            "Unit 4 Journey Across a Vast Land",
            "Unit 5 First Aid",
        ], []),
        ("12a", 12, "上", [
            "Unit 1 Art",
            "Unit 2 Healthy Lifestyle",
            "Unit 3 Environmental Protection",
            "Unit 4 Adversity and Courage",
            "Unit 5 Poems",
        ], []),
        ("12b", 12, "下", [
            "Unit 1 Science Fiction",
            "Unit 2 Iconic Attractions",
            "Unit 3 Sea Exploration",
            "Unit 4 Sharing",
            "Unit 5 Launching Your Career",
        ], []),
    ],
}
