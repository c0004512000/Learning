# Lesson 03 擴充證據：分析身分、CI Checkout 與測試報告（2026-11-08）

## 範圍與版本
- 範圍：**原生 SonarQube Community Build**；商業版差異僅作概念對照。並未在此執行新實驗或驗證特定安裝版本。
- 來源衝突處理：功能表的「Community Build」與「SonarQube Cloud Free plan」為**不同欄位**；Cloud Free 的限定 PR 支援**不能**移植成 Community Build 的功能。
  - https://docs.sonarsource.com/sonarqube-community-build/feature-comparison-table
  - https://docs.sonarsource.com/sonarqube-community-build/devops-platform-integration/github-integration/adding-analysis-to-github-actions-workflow

## 查證事實
1. **Scanner 的執行位置與責任**：SonarScanner 在 Runner/CI 或其他執行環境分析已 checkout 的原始碼並提交結果；Compute Engine 在 Server 上非同步處理，Dashboard/Quality Gate 要等背景任務完成。
   - https://docs.sonarsource.com/sonarqube-community-build/analyzing-source-code/analysis-overview
   - https://docs.sonarsource.com/sonarqube-community-build/analyzing-source-code/scanners/sonarscanner
   - https://docs.sonarsource.com/sonarqube-server/analyzing-source-code/background-tasks
2. **GitHub Actions 觸發與分析維度不同**：Community Build 原生僅有 main-branch analysis；官方建議只於單一被追蹤分支 push 掃描，避免設定 `on.pull_request`。GitHub Actions 的自動 PR/Branch 分析身分辨識，SonarQube Server GitHub Actions 文件明確從 Developer Edition 開始。
   - https://docs.sonarsource.com/sonarqube-community-build/devops-platform-integration/github-integration/adding-analysis-to-github-actions-workflow
   - https://docs.sonarsource.com/sonarqube-server/2025.6/devops-platform-integration/github-integration/adding-analysis-to-github-actions-workflow
3. **Project 與 Source Branch**：`sonar.projectKey` 指向 Project；沒有獨立 Branch/PR 身分的正常分析會歸到 Project main branch，不因 checkout 改動而自動重新命名。這不等於 Community 可把多分支獨立儲存。同一 Repo 可設多個 Project Key 作分別追蹤，但不是原生 Multi-Branch Analysis。
   - https://docs.sonarsource.com/sonarqube-community-build/project-administration/creating-project
   - https://docs.sonarsource.com/sonarqube-server/2025.6/analyzing-source-code/branch-analysis/setting-up-the-branch-analysis
   - https://docs.sonarsource.com/sonarqube-community-build/feature-comparison-table
4. **PR Checkout 的版本差異**：對「開啟且可合併的 PR」，GitHub `pull_request` 事件預設 `GITHUB_REF=refs/pull/N/merge`、`GITHUB_SHA` 是模擬合併提交，因此未指定 ref 的 checkout 取得模擬合併內容；可指定 `github.event.pull_request.head.sha` 取來源分支 HEAD。這只是 GitHub checkout 行為，**不是 SonarQube 的 PR 分析能力**。商業版 SonarQube PR analysis 的前提是掃描來源分支且取得目標分支歷史；不應將兩者混淆。
   - https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#pull_request
   - https://github.com/actions/checkout#checkout-pull-request-head-commit-instead-of-merge-commit
   - https://docs.sonarsource.com/sonarqube-server/10.8/analyzing-source-code/pull-request-analysis/setting-up-the-pull-request-analysis
5. **PR 分析與 New Code**：商業版 PR 分析針對相對目標分支的變更，以 New Code 條件評估 Quality Gate；並不意味它能保證兩條分支持續前進時合併後完全無問題。分支分析則保留某分支品質狀態。與合併結果 CI 測試是兩種驗證目的。
   - https://docs.sonarsource.com/sonarqube-server/2025.1/analyzing-source-code/pull-request-analysis/introduction
   - https://docs.sonarsource.com/sonarqube-community-build/user-guide/about-new-code
6. **Project 建立**：Local Project、DevOps 平台匯入、Web API、First Scan（需 Create Projects 權限）都是官方列舉途徑。主分支名稱的初始值需依建立方式/版本核對，不應斷言第一次掃哪個分支就會自動以它命名；重新命名顯示名不會改變 Checkout。商業版分支管理 UI 說明不能直接冒充 Community 的 UI。
   - https://docs.sonarsource.com/sonarqube-community-build/project-administration/creating-project
   - https://docs.sonarsource.com/sonarqube-server/2025.6/project-administration/maintaining-project/maintaining-the-branches-of-your-project
7. **測試報告**：Coverage 與 Test Execution 分開：外部工具先執行，Scanner 匯入支援格式；Generic Coverage `sonar.coverageReportPaths`，Generic Test Execution `sonar.testExecutionReportPaths`。Playwright E2E 的通過／失敗統計須先轉成相容格式並能對應測試檔；不能把 E2E case 數量當 coverage。壓測指標（RPS、p95 等）並非內建 SonarQube 壓測 Dashboard。
   - https://docs.sonarsource.com/sonarqube-community-build/analyzing-source-code/test-coverage/overview
   - https://docs.sonarsource.com/sonarqube-community-build/analyzing-source-code/test-coverage/generic-test-data
   - https://docs.sonarsource.com/sonarqube-community-build/analyzing-source-code/test-coverage/test-execution-parameters

## 未驗證／不得宣稱的部分
- 未以受控 POC 親自驗證本安裝版本對明確傳入 `sonar.branch.name`、`sonar.pullrequest.key` 的確切錯誤訊息。教學僅能說 Community **不支援原生** Branch/PR analysis，不把特定 error text 當已觀察。
- 沒有驗證 Community Build 主分支重新命名功能在特定 UI 中是否顯示；不提供版本不明的 UI 點擊教學。
- 沒有驗證「PR 觸發但不帶特殊參數」在所有配置下都會成功。**沒有要求獨立分析身分時，可能落到唯一 main 狀態；成功仍取決於 Scanner、權限、Checkout、Server 等其他條件**，不可宣稱一定成功。
- 沒有新增內部 CI workflow、機密 host、token 或 POC 圖像到公開教材。
