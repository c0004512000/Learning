# SonarSource 官方參考來源與用途（External Linked Sources）

這些是官方外部來源，作為使用者起點材料不足以證明實作行為時的權威補充。不同版本的行為可能不同；每次實測需記錄所安裝的版號，不能把多版本文件混為同一套畫面。

- [Analysis overview](https://docs.sonarsource.com/sonarqube-community-build/analyzing-source-code/analysis-overview) — 解釋 Scanner 提交與 Server 處理的責任邊界。
- [GitHub Actions](https://docs.sonarsource.com/sonarqube-community-build/devops-platform-integration/github-integration/adding-analysis-to-github-actions-workflow) — 官方明示 Community Build 只分析主分支，避免把 `on: pull_request` 誤認成產品支援 PR Analysis。
- [GitHub integration](https://docs.sonarsource.com/sonarqube-community-build/devops-platform-integration/github-integration/introduction) — GitHub App、匯入與認證的用途，避免把 App 誤當成 Scanner 的前置條件。
- [Creating project](https://docs.sonarsource.com/sonarqube-community-build/project-administration/creating-project) — Project 是 SonarQube 內的分析歸屬；可以由平台匯入、手動、API 或首次掃描建立。
- [Quality Profiles](https://docs.sonarsource.com/sonarqube-community-build/quality-standards-administration/managing-quality-profiles/understanding-quality-profiles) — 釐清規則集合與 Gate 條件不是同一層。
- [Quality Gates](https://docs.sonarsource.com/sonarqube-community-build/quality-standards-administration/managing-quality-gates/introduction-to-quality-gates) — 判定符合條件與 CI 是否阻擋分開。
- [New Code](https://docs.sonarsource.com/sonarqube-community-build/user-guide/about-new-code) — 主分支 New Code 不等於 PR 差異分析。
- [Coverage](https://docs.sonarsource.com/sonarqube-community-build/analyzing-source-code/test-coverage/overview) — 由外部工具先產生報告再匯入。
- [Docker](https://docs.sonarsource.com/sonarqube-community-build/server-installation/from-docker-image/set-up-and-start-container) / [Database](https://docs.sonarsource.com/sonarqube-community-build/server-installation/installing-the-database) / [Helm](https://docs.sonarsource.com/sonarqube-community-build/server-installation/on-kubernetes-or-openshift/customizing-helm-chart) — POC、資料庫與 K8s 的官方基準。

### Source selection
- 若「Community Build」與「SonarQube Server」同名功能有不同說明，以 Community Build / 已固定的實際版本為準。
- 官方頁面可能包含不符合免費版的範例或多版本更新，將「官方推薦設定」與「示意」分開標示。
- 尚無任何 SonarQube Server UI 實測截圖；不應以仿製 UI 當成實測憑證。
