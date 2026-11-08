# Checkout、Project Key 與分析身分是不同層級

在無提示的情境題中，學習者能判斷：Scanner 對 Checkout 的 Git Branch 實際程式碼分析，未指定原生獨立 Branch 身分時，結果歸到 `sonar.projectKey` 指向的 Project Main Branch；Dashboard 的 Main Branch 名稱不會隨 Checkout 自動更改。此外，學習者能提出 Community Build 依 Branch Name 分流到不同 Project Keys 的可行策略，並區分付費版「同一 Project 原生管理多個 Branch」的能力。這代表後續教學可直接運用「來源 vs. 分析歸屬」模型，但不代表 Lesson 03／04 全部驗收通過。

**證據：** 2026-11-09 的兩個情境回答（Checkout `develop`、不同 Branch 使用不同 Project Keys）。仍待測試 PR 分析身分、Tag SHA／Project Version 和跨情境 Gate 的獨立推導。
