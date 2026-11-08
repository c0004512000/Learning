# Phase 07：Multi-language Pilot / Shared Workflow / Governance — 2026-11-09

此 Evidence 檔核對 SonarSource 與 GitHub 官方資料。它不是任何私人 Repo／Runner／SonarQube 服務的驗收報告；教學數值皆為合成示例。

## 可驗證的官方事實
1. Java 分析需要已編譯的 Bytecode；多檔 Java Source 若沒有 `.class` 與 `sonar.java.binaries` 可能失敗。優先使用 Maven／Gradle Scanner。https://docs.sonarsource.com/sonarqube-community-build/analyzing-source-code/languages/java
2. JS/TS 有獨立 Analyzer，預設排除 node_modules、dist 等檔案；各語言需分別檢查 Scanner 與工具 Runtime。https://docs.sonarsource.com/sonarqube-community-build/analyzing-source-code/languages/javascript-typescript-css
3. Coverage 由外部測試工具生成，再由 Scanner 匯入。Java：`sonar.coverage.jacoco.xmlReportPaths`（JaCoCo XML）；JS／TS：`sonar.javascript.lcov.reportPaths`（LCOV）；Python：`sonar.python.coverage.reportPaths`（Cobertura XML）。https://docs.sonarsource.com/sonarqube-community-build/analyzing-source-code/test-coverage/test-coverage-parameters
4. Quality Profile 是按語言啟用的 Rule 集；Project 可依語言明確指定自訂 Profile。Quality Gate 是 Project 條件集合、可明確指派不同 Gate。https://docs.sonarsource.com/sonarqube-community-build/project-administration/adjusting-analysis/changing-quality-profiles ; https://docs.sonarsource.com/sonarqube-community-build/quality-standards-administration/managing-quality-gates/associating-projects-with-quality-gate
5. Project Analysis Token 限於單一 Project，與 Global Analysis Token 或 User Token 的權限範圍不同；Global Execute Analysis 默認可能授與 sonar-users，專案 Visibility 可能預設 Public，需要稽核。https://docs.sonarsource.com/sonarqube-community-build/user-guide/managing-tokens ; https://docs.sonarsource.com/sonarqube-community-build/instance-administration/user-management/user-permissions
6. Reusable Workflow 由 GitHub Actions 提供，可以使用 `workflow_call`，Caller／Callee 有 Secret 與權限傳遞規則；可用 Tag、Branch 或 SHA 參照，導入政策應偏向不可變版本和受審核變更。https://docs.github.com/en/actions/reference/workflows-and-actions/reusing-workflow-configurations

## 導入策略屬本課的推導，不是產品保證
- 不能直接以跨語言 Raw Issue Count、Coverage 百分比或 Scanner SUCCESS 斷言品質比較有效；必須先確認 Profile／Exclusion／建置產物／Coverage 路徑／New Code 定義可比。
- 平台共享 Workflow 應固定 Project Identity、Source SHA、Scanner／Server Contract，讓 Repo 提供語言專屬前置報告；需自行驗證 Caller 的 Checkout／Secrets 是否與共享 Workflow 路徑一致。
- Observe／Warn／Enforce、RPO/RTO、false-positive triage 與 Go／No-Go 門檻是組織的治理決策，不能因某個 Sample Workflow 成功就自動宣稱生產 Rollout 已準備完成。

## Phase 07 的理解與實作驗收
- L13：兩種語言各有成功 Scan 和有效 Coverage 的 CE Task／Dashboard 證據，能解釋 Bytecode、Report Path 與 Quality Profile 如何影響結果；受控已知違規能正確偵測。
- L14：交付可審核的 shared workflow contract、每 Project Token／權限配置、Pilot 指標、Gate／Outage 實驗與 Go／No-Go Decision Record（含回退），不輸出私人 Repo 資料。
- 未實測；Phase 03 仍暫緩；正式學習驗收完成率不因本次撰寫而提高。
