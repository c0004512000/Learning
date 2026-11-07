# Mission: SonarQube Community Build 導入評估

## Why
公司已有 GitHub Actions、Runner、Kubernetes、測試與部署門禁，需要評估是否能**在不購買商業版的前提下**，加入可信、可維運的原始碼品質檢查。目標不是單純把服務裝起來，而是做出一份有實測證據、清楚揭露免費版限制的導入決策。

## Success looks like
- 能從一份程式碼修改推導 Scanner → Server / Compute Engine → Project → Dashboard / Quality Gate 的資料與判定流程。
- 能用實際案例分清 GitHub 觸發、Scanner 執行、主分支分析、PR 原生分析與 New Code 的邊界。
- 能在核准的隔離環境完成單一合成 repo 的 POC，留下分析結果、Background Task、Issues、Gate 的可重複驗證證據。
- 能說明 Coverage 來自何處，在 GitHub Actions 做安全的非阻擋掃描並測試連線、認證、品質 Gate 失敗路徑。
- 能提出是否導入、如何擴展與回退的 CI/CD、Kubernetes、資料庫、權限與維運方案；未實測部分標為待驗證。

## Constraints
- SonarQube Community Build 免費版；不得假設商業版 PR / multi-branch 功能可用。
- 從第一性原理建立概念，採繁體中文與可手機閱讀的 HTML。
- 學習先行、POC 先於 Production 整合；以合成資料和核准工具實驗。
- 本 GitHub Pages repo 是公開網站，不收錄公司內部資訊、Token、私有程式碼或敏感截圖。
- 完整主線先規劃，詳細 Lesson 逐步撰寫；閱讀不計入理解或實作驗收。

## Out of scope
- 購買／導入付費版，或把自製 PR workaround 宣稱為免費版原生 PR Analysis。
- 未經核准直接修改公司正式 CI、部署叢集或現有 Release Gate。
