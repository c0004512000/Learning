# Phase 05：GitHub Trigger 與 Release Quality Gate — Source Verification

核對日期：2026-11-09；研究範圍：SonarQube Community Build、GitHub Actions。此檔儲存教材所據的公開文件，**不是**個人／公司 Runner 的實機驗收。

## 官方已確認的行為

1. Community Build 只支援原生 Main Branch 分析，官方建議在 `push main` 掃描，不使用 `pull_request` 來冒充原生 PR 分析與 Decoration。GitHub Event 的觸發能力與 SonarQube Server 儲存 PR 身分的能力不同。來源：https://docs.sonarsource.com/sonarqube-community-build/devops-platform-integration/github-integration/adding-analysis-to-github-actions-workflow ; https://docs.sonarsource.com/sonarqube-community-build/devops-platform-integration/github-integration/introduction
2. GitHub `pull_request` 開啟／更新時，預設常 Checkout merge ref；`closed` 後如果已合併，`GITHUB_REF` 是合併目的分支的 ref。可以用 `github.event.pull_request.merged` 篩選成功合併；應確認 merge SHA 與實際 Checkout。來源：https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#pull_request
3. `push` 的 `branches` 與 `tags` 決定事件範圍，`actions/checkout` 取得的 ref/SHA 決定 Runner 所見程式碼。Release Tag 與 `sonar.projectVersion` 可以一起記錄軟體版本，但標版本不是 Git Diff，亦不會得到獨立 Tag Branch。來源：https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#push ; https://docs.sonarsource.com/sonarqube-community-build/analyzing-source-code/analysis-parameters/parameters-not-settable-in-ui
4. Scanner `sonar.qualitygate.wait` 預設 false；設 true 會輪詢直到 CE 完成並取得 Gate，FAIL 令 Scan Step Fail；`sonar.qualitygate.timeout` 預設 300 秒。也可用官方 Quality Gate Check Action。來源：https://docs.sonarsource.com/sonarqube-community-build/devops-platform-integration/github-integration/adding-analysis-to-github-actions-workflow ; https://docs.sonarsource.com/sonarqube-community-build/analyzing-source-code/analysis-parameters/parameters-not-settable-in-ui
5. GitHub Actions `needs` 的必要上游 Job 失敗或略過，後續 Job 預設會略過，除非另有 Conditional Logic；`if: always()`、`continue-on-error` 可能改變失敗傳遞。來源：https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax
6. GitHub Actions Concurrency 可避免同 Group 同時執行，但仍有排隊取消／順序等政策細節；不能只靠一條 Concurrency 宣稱解決所有過期分析／版本身分問題。來源：https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency

## 教學推導：不是官方承諾的產品功能

- 同一個 Community Project Key 分別分析 main、Tag、舊 Tag，會更新同一個主分支分析歷史；最近完成的分析不必然是最新 Release SHA。不要拿沒有綁定本次 CE Task 的「目前 Project Gate PASS」來證明待發布 Tag 已通過。
- 主分支 Push、PR Merge、Tag 可能對同一 Commit 多次執行掃描；要選唯一權威來源或規劃去重與版本身分追溯。不能把 Community 當成付費版的 PR Gate。
- 品質 Gate FAIL 與平台故障分別是「品質不合格」與「沒有可信品質判定」；Fail-open／Fail-closed、例外與 SLA 是組織 CI 政策，不是 SonarQube 的自動管理功能。
- Non-blocking 階段不應把 Rule 停掉或讓 Gate 假 PASS；可以讓部署不依賴觀測 Job。

## 對 L09／L10 的驗收要求

- L09：用匿名 main/PR/Tag 時間線，指出每個事件 SHA、Git checkout 與 SonarQube Project 結果歸屬；解釋被較舊 Tag 重掃時的風險；能自行選擇權威 Trigger 與理由。
- L10：演算 CE SUCCESS/Gate FAIL、Scanner 401、CE FAILED、Timeout、錯 SHA 四種風險與 CI Job/Deployment 結果；交付可審核之 rollout／exception／rollback policy 並於核准 POC 驗證。

## 未驗證

- 未執行任何公司 Production Job、未配置私人 Sonar Token、未實際測試 Server 停機、並行 GitHub Actions、Gate FAIL Deployment。
- GitHub Pages Desktop／Mobile Browser 尚需另外做實際視窗及 Network QA；靜態驗證不能取代瀏覽器驗證。
