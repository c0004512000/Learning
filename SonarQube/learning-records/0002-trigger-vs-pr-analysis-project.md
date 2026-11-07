# Learning Record 0002 — Trigger vs. PR analysis; Project prerequisite

日期：2026-11-07。關聯：Phase 02, Lesson 03 → Phase 03, Lesson 05。

## 學習者的概念缺口（尚非錯誤判定）
- 使用者指出「既然 GitHub Actions 觸發 Scanner，為什麼說免費版不能分析 PR？」說明教材將觸發條件與 SonarQube 分析結果支援維度放得太近，未明示實際執行分析可能存在但無法建立獨立 PR 分析狀態。
- 使用者亦不清楚 SonarQube Project，教材過早使用該名詞。

## 對教材的結構要求
- Lesson 03 區分 trigger、checkout、scanner、report/branch context、server-native storage & PR comparison 五個不同環節；兩種情境（合併前 PR／合併後 main）對照。
- 在第一次出現 Project 的地方加入小型橋接：Project / Project Key / Repo mapping。
- Phase 03, Lesson 05 的必需前置：Repository → Project → Project Key → Main Branch → Dashboard，再進 Docker 與資料庫；後面 L06 才動手掃描。
- 只有提出問題，沒有理解驗收證據，不應標記 Lesson 03 已完成。

## Official sources
- https://docs.sonarsource.com/sonarqube-community-build/devops-platform-integration/github-integration/adding-analysis-to-github-actions-workflow
- https://docs.sonarsource.com/sonarqube-community-build/analyzing-source-code/overview
