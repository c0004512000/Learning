# SonarQube Learning Resources

資料檢視：2026-11-09。以目前 Community Build 官方文件為準；開始 POC 前應固定實際版本並重新確認變動功能。

## Knowledge（權威技術依據）

### 起點與分析模型
- [Analysis overview](https://docs.sonarsource.com/sonarqube-community-build/analyzing-source-code/analysis-overview) — Scanner、Server 及分析任務的基本流程；適用 Lesson 01–02。
- [Creating your project](https://docs.sonarsource.com/sonarqube-community-build/project-administration/creating-project) — Project 的建立方式與 Repository 對應；適用 Lesson 05。
- [GitHub integration](https://docs.sonarsource.com/sonarqube-community-build/devops-platform-integration/github-integration/introduction) — GitHub App、repo 匯入與免費版限制；適用 Lesson 03。
- [GitHub Actions analysis](https://docs.sonarsource.com/sonarqube-community-build/devops-platform-integration/github-integration/adding-analysis-to-github-actions-workflow) — 僅掃描主分支的官方建議、Runner 準備與 Gate 回傳；適用 Lesson 03、07、09。
- [Feature comparison](https://docs.sonarsource.com/sonarqube-community-build/feature-comparison-table) — Community Build 與其他產品的 branch / PR 功能邊界；適用 Lesson 03、09。

- [SonarScanner CLI](https://docs.sonarsource.com/sonarqube-community-build/analyzing-source-code/scanners/sonarscanner) — Scanner 的 CLI、Docker 與執行方式；適用 Lesson 02–03。
- [GitHub pull_request event](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#pull_request) — 觸發 PR 後的模擬合併 ref/SHA 與 checkout 差異；適用 Lesson 03、09。
- [GitHub push / tags / merged PR events](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows) — Branch、Tag 與 closed+merged 的觸發、GITHUB_SHA；適用 L09。
- [GitHub Actions jobs.needs / if](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax) — CI Gate FAIL 如何傳遞到 Deploy Job；適用 L08、L10。
- [GitHub Actions concurrency](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency) — 版本掃描競爭與取消語意；適用 L09–L10。
- [PR Analysis (Server 2025.1)](https://docs.sonarsource.com/sonarqube-server/2025.1/analyzing-source-code/pull-request-analysis/introduction) — 商業版 PR 的 New Code 範圍及 Gate；僅作對照。
- [Generic Test Data](https://docs.sonarsource.com/sonarqube-community-build/analyzing-source-code/test-coverage/generic-test-data) — Generic Coverage / Test Execution 格式；適用 Reference 與後續測試整合。

### 規則與門檻
- [Rules](https://docs.sonarsource.com/sonarqube-community-build/quality-standards-administration/managing-rules/rules) — 規則與 Issue 的關係；適用 Lesson 04、13。
- [Quality Profiles](https://docs.sonarsource.com/sonarqube-community-build/quality-standards-administration/managing-quality-profiles/understanding-quality-profiles) — 語言規則組如何選取；適用 Lesson 04、13。
- [Quality Gates](https://docs.sonarsource.com/sonarqube-community-build/quality-standards-administration/managing-quality-gates/introduction-to-quality-gates) — 指標條件、PASS / FAIL 與 CI；適用 Lesson 04、08、10。
- [New Code](https://docs.sonarsource.com/sonarqube-community-build/user-guide/about-new-code) — 新增程式碼定義不是 PR Analysis；適用 Lesson 03–04、09。
- [Coverage overview](https://docs.sonarsource.com/sonarqube-community-build/analyzing-source-code/test-coverage/overview) — 外部測試工具先產生報告，再由 Scanner 匯入；適用 Lesson 08。

### Custom Rules 與 New Code 基準
- [Adding coding rules](https://docs.sonarsource.com/sonarqube-community-build/extension-guide/adding-coding-rules) — Java Plugin／XPath／External Issues 三條路線。
- [Rule templates and metadata](https://docs.sonarsource.com/sonarqube-community-build/quality-standards-administration/managing-rules/rules) — Rule Type、MQR 多品質、模板型 Custom Rule 設定。
- [Project Quality Profiles](https://docs.sonarsource.com/sonarqube-community-build/project-administration/adjusting-analysis/changing-quality-profiles) — 按 Project 的語言指派 Profile。
- [Specific analysis baseline](https://docs.sonarsource.com/sonarqube-community-build/project-administration/adjusting-analysis/configuring-new-code-calculation) — Community Build 的 Specific analysis 需經 Web API。
- [External issues](https://docs.sonarsource.com/sonarqube-community-build/analyzing-source-code/importing-external-issues/about-external-issues) — 匯入 Issues 可參與 Gate，不等於匯入可在 Profile 啟停的 Rule。
- [Scanner Quality Gate waiting](https://docs.sonarsource.com/sonarqube-community-build/analyzing-source-code/analysis-parameters/parameters-not-settable-in-ui) — sonar.qualitygate.wait 等候 Server 狀態。

### Kubernetes 與備份復原
- [Server Components](https://docs.sonarsource.com/sonarqube-community-build/server-installation/server-components-overview) — Web／CE／ES／DB 的資料責任，適用 L11。
- [Kubernetes prerequisites](https://docs.sonarsource.com/sonarqube-community-build/server-installation/on-kubernetes-or-openshift/before-you-start) — 26.2 DB Dependency、Argo CD 相容性限制、Probe。
- [Helm customization](https://docs.sonarsource.com/sonarqube-community-build/server-installation/on-kubernetes-or-openshift/customizing-helm-chart) — JDBC、Restricted、ES Persistence、Secrets、Ingress。
- [Server requirements](https://docs.sonarsource.com/sonarqube-community-build/server-installation/server-host-requirements) — Kernel、JVM Heap 與容量。
- [Networking requirements](https://docs.sonarsource.com/sonarqube-community-build/server-installation/networking-requirements) — Runner → API、Server → DB、HTTPS。
- [Database backup and restore](https://docs.sonarsource.com/sonarqube-community-build/server-update-and-maintenance/maintenance/backup-and-restore) — Hot Backup 與 Restore。
- [Elasticsearch reindexing](https://docs.sonarsource.com/sonarqube-community-build/server-update-and-maintenance/maintenance/reindexing) — ES Index 可重建、Gate Wait 可能 Timeout。
- [Update path](https://docs.sonarsource.com/sonarqube-community-build/server-update-and-maintenance/update/determine-path) — Calendar Version 更新路徑。
- [Pre-update steps](https://docs.sonarsource.com/sonarqube-community-build/server-update-and-maintenance/update/pre-update-steps) — DB Backup、容量與 Staging Drill。

### POC 與營運
- [Docker setup](https://docs.sonarsource.com/sonarqube-community-build/server-installation/from-docker-image/set-up-and-start-container) — 隔離環境基本啟動與持久化掛載；適用 Lesson 05。
- [Database requirements](https://docs.sonarsource.com/sonarqube-community-build/server-installation/installing-the-database) — H2 僅作試驗用途、正式環境持久化資料庫；適用 Lesson 05、11–12。
- [Kubernetes Helm configuration](https://docs.sonarsource.com/sonarqube-community-build/server-installation/on-kubernetes-or-openshift/customizing-helm-chart) — 外部 DB 與 Kubernetes 設定；適用 Lesson 11。
- [Official SonarQube Scan Action](https://github.com/SonarSource/sonarqube-scan-action) — GitHub Actions Scanner 整合、版本與限制；適用 Lesson 07。
- [原始教材起點](sources/materials/starting-point.md) — 學習需求與示意架構圖的使用者描述；屬於需求素材而非技術權威。

### Phase 07：多語言 Pilot 與共用 Workflow
- [Java Analyzer](https://docs.sonarsource.com/sonarqube-community-build/analyzing-source-code/languages/java) — Bytecode、Maven／Gradle Scanner 的前提。
- [JS／TS Analyzer](https://docs.sonarsource.com/sonarqube-community-build/analyzing-source-code/languages/javascript-typescript-css) — Exclusions、Runtime 與完整分析輸入。
- [Coverage Parameters](https://docs.sonarsource.com/sonarqube-community-build/analyzing-source-code/test-coverage/test-coverage-parameters) — JaCoCo、LCOV、Python Coverage XML。
- [Project Token](https://docs.sonarsource.com/sonarqube-community-build/user-guide/managing-tokens) — Project Analysis Token 與最小權限。
- [Instance Permissions](https://docs.sonarsource.com/sonarqube-community-build/instance-administration/user-management/user-permissions) — Global Execute Analysis、Visibility。
- [Reusable Workflows](https://docs.github.com/en/actions/reference/workflows-and-actions/reusing-workflow-configurations) — workflow_call 與 Secrets。

## Learner-facing Reference
- [Scanner／分析身分／PR／測試報告速查](reference/0003-analysis-identity-and-test-data.html) — 補充 L03 的參數、Project 建立及測試資料適用性；可從 L03 返回。
- [Rule／Profile／Gate／New Code 速查](reference/0004-rules-gates-new-code.html) — L04 的自訂 Rule 路線、Metadata、門禁和固定基準設定。
- [Release Tag／Project Version／New Code](reference/0005-new-code-release-version.html) — 版本基準、滾動日期與既往不咎政策。
- [Community Build vs Commercial](reference/0006-community-vs-commercial.html) — Branch、PR Analysis／Decoration 與功能版別。
- [Release Gate 決策矩陣](reference/0007-release-gate-decision.html) — CI Trigger、SHA、Gate／Deployment、失效與例外。
- [Kubernetes 架構／維運／恢復速查](reference/0008-kubernetes-operations.html) — DB 權威資料、ES 重建、PVC、Host / Helm / Restore / Update 的故障判斷。

## Wisdom（實務交流）
- [Sonar Community](https://community.sonarsource.com/) — 官方維護的使用者論壇；遇到版本特定的 Scanner／Quality Gate 行為時，可查對照案例。社群回答須與該版官方文件、實測結果交叉檢查。

- [Phase 07 多語言 Pilot／Rollout 決策速查](reference/0009-pilot-rollout-checklist.html) — Coverage、Project Token、共用 Workflow 與 Go／No-Go 矩陣。

## Evidence 與課程映射
- [Phase 07 官方核對](sources/evidence/2026-11-09-phase7-pilot-governance.md) — Java Bytecode、Coverage 報告、Project Token、Reusable Workflow；尚未實測。
- [Phase 06 Kubernetes／Restore／Upgrade 官方核對](sources/evidence/2026-11-09-phase6-kubernetes.md) — DB／ES／Helm／Argo CD 及復原規則；未實機驗證。
- [Phase 05 Trigger／Gate 治理官方核對](sources/evidence/2026-11-09-phase5-governance.md) — 官方事件語意、Scanner 等候與 GitHub Job Dependency；**尚未實機驗證**。
- [L04 Rules／Gates／New Code 官方核對](sources/evidence/2026-11-09-l04-governance.md) — 可追溯規則建立、Specific analysis API、CI 等待與 Coverage 邊界。
- [L03 分析歸屬與測試資料核對](sources/evidence/2026-11-08-analysis-identity-and-test-data.md) — 依新版官方資料核對 Scanner、PR Checkout、免費版及報告格式。
- [初始來源核對](sources/evidence/2026-11-official-baseline.md) — 初始分析模型與未驗證範圍。
- [Phase 02 核對](sources/evidence/2026-11-phase2-baseline.md) — branch / PR 與 Rules、Profiles、Gates。
- [課程來源與驗收矩陣](sources/evidence/2026-11-source-matrix.md) — 每堂來源及可觀察的驗收標準。
- [已連結的外部資料來源](sources/linked/external/sonarsource-docs.md) — 來源選取與更新界線。

## Gaps（待有證據才可宣稱完成）
- Phase 07 尚未提供兩種語言的完整 Scan／Coverage／Issue 實測、共享 Workflow Canary 或 Go／No-Go 決策證據。
- 尚無公司私有 GitHub Workflows 的逐檔稽核、Runner 網路與 TLS 連線證據。
- 公開課程尚未保存可供驗收的完整實機 POC 證據鏈（Checkout SHA、Scanner、CE Task、Gate、Deployment），因此不能據此宣稱 Phase 04／05 已通過。
- 尚無可公開引用的正式 K8s、PostgreSQL Restore、ES Reindex 或升級演練證據。
- 已有部分 L03 分析身分情境作答紀錄，但其餘 Lesson 尚未完成正式驗收；首頁的「已撰寫」不得當作學習完成率。

這份清單是課程的參考依據，不表示所有後續階段的操作已經執行成功。
