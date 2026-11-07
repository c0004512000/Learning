# SonarQube Learning Resources

資料檢視：2026-11-07。以目前 Community Build 官方文件為準；開始 POC 前應固定實際版本並重新確認變動功能。

## Knowledge（權威技術依據）

### 起點與分析模型
- [Analysis overview](https://docs.sonarsource.com/sonarqube-community-build/analyzing-source-code/analysis-overview) — Scanner、Server 及分析任務的基本流程；適用 Lesson 01–02。
- [Creating your project](https://docs.sonarsource.com/sonarqube-community-build/project-administration/creating-project) — Project 的建立方式與 Repository 對應；適用 Lesson 05。
- [GitHub integration](https://docs.sonarsource.com/sonarqube-community-build/devops-platform-integration/github-integration/introduction) — GitHub App、repo 匯入與免費版限制；適用 Lesson 03。
- [GitHub Actions analysis](https://docs.sonarsource.com/sonarqube-community-build/devops-platform-integration/github-integration/adding-analysis-to-github-actions-workflow) — 僅掃描主分支的官方建議、Runner 準備與 Gate 回傳；適用 Lesson 03、07、09。
- [Feature comparison](https://docs.sonarsource.com/sonarqube-community-build/feature-comparison-table) — Community Build 與其他產品的 branch / PR 功能邊界；適用 Lesson 03、09。

### 規則與門檻
- [Rules](https://docs.sonarsource.com/sonarqube-community-build/quality-standards-administration/managing-rules/rules) — 規則與 Issue 的關係；適用 Lesson 04、13。
- [Quality Profiles](https://docs.sonarsource.com/sonarqube-community-build/quality-standards-administration/managing-quality-profiles/understanding-quality-profiles) — 語言規則組如何選取；適用 Lesson 04、13。
- [Quality Gates](https://docs.sonarsource.com/sonarqube-community-build/quality-standards-administration/managing-quality-gates/introduction-to-quality-gates) — 指標條件、PASS / FAIL 與 CI；適用 Lesson 04、08、10。
- [New Code](https://docs.sonarsource.com/sonarqube-community-build/user-guide/about-new-code) — 新增程式碼定義不是 PR Analysis；適用 Lesson 03–04、09。
- [Coverage overview](https://docs.sonarsource.com/sonarqube-community-build/analyzing-source-code/test-coverage/overview) — 外部測試工具先產生報告，再由 Scanner 匯入；適用 Lesson 08。

### POC 與營運
- [Docker setup](https://docs.sonarsource.com/sonarqube-community-build/server-installation/from-docker-image/set-up-and-start-container) — 隔離環境基本啟動與持久化掛載；適用 Lesson 05。
- [Database requirements](https://docs.sonarsource.com/sonarqube-community-build/server-installation/installing-the-database) — H2 僅作試驗用途、正式環境持久化資料庫；適用 Lesson 05、11–12。
- [Kubernetes Helm configuration](https://docs.sonarsource.com/sonarqube-community-build/server-installation/on-kubernetes-or-openshift/customizing-helm-chart) — 外部 DB 與 Kubernetes 設定；適用 Lesson 11。
- [Official SonarQube Scan Action](https://github.com/SonarSource/sonarqube-scan-action) — GitHub Actions Scanner 整合、版本與限制；適用 Lesson 07。
- [原始教材起點](sources/materials/starting-point.md) — 學習需求與示意架構圖的使用者描述；屬於需求素材而非技術權威。

## Wisdom（實務交流）
- [Sonar Community](https://community.sonarsource.com/) — 官方維護的使用者論壇；遇到版本特定的 Scanner／Quality Gate 行為時，可查對照案例。社群回答須與該版官方文件、實測結果交叉檢查。

## Evidence 與課程映射
- [初始來源核對](sources/evidence/2026-11-official-baseline.md) — 初始分析模型與未驗證範圍。
- [Phase 02 核對](sources/evidence/2026-11-phase2-baseline.md) — branch / PR 與 Rules、Profiles、Gates。
- [課程來源與驗收矩陣](sources/evidence/2026-11-source-matrix.md) — 每堂來源及可觀察的驗收標準。
- [已連結的外部資料來源](sources/linked/external/sonarsource-docs.md) — 來源選取與更新界線。

## Gaps（待有證據才可宣稱完成）
- 尚無公司私有 GitHub Workflows 的逐檔稽核、Runner 網路與 TLS 連線證據。
- 尚未啟動真實 SonarQube POC，因此沒有可稽核的 Dashboard 截圖、Issues、Background Tasks 或失敗注入結果。
- 尚無正式 K8s / PostgreSQL 安裝、復原或升級實測。
- 未有可驗證的學習者作答或操作成果；首頁的「已撰寫」不得作為學習完成率。

這份清單是課程的參考依據，不表示所有後續階段的操作已經執行成功。
