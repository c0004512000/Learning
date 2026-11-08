# Teaching Notes（非 Learning Records）

## 穩定偏好
- 使用繁體中文（台灣用語）、第一性原理、因果鏈。先從看得到的行為建立必要概念，之後才命名。
- 偏好手機可讀、乾淨、深色與青綠重點的流程圖；CSS 可獨立設計，但教學規則仍依 canonical Learning-from-docs。
- 公開教材使用合成情境，不公開公司私有 repo／網路／Credential。
- 對實驗性操作需區分「預期」與「實際觀察」；沒有證據不宣稱已驗證。

## 概念缺口 → 教學約束（尚未證明理解）
### Analysis Report vs Compute Engine（2026-11-07）
- 過去的說明直接跳到「Compute Engine 處理報告」，缺少「Report 是什麼」以及 Scanner／CE 責任邊界。
- Lesson 02 在解釋非同步處理前先建立 Scanner 產出的結構化資料與後續彙總的差別。
- 並未取得學習者的正確作答，因此不能推斷該概念已掌握。

### Trigger vs PR analysis、Project（2026-11-07）
- GitHub `pull_request` 可以啟動 Runner，不代表 SonarQube 免費版支援 PR 獨立分析；教材須顯示 trigger → checkout → scanner → server 支援維度的因果路徑。
- Project 應在第一次被用來解釋其他概念前，以 Repo → Project → Project Key 作最小橋接；Phase 03 Lesson 05 再深入。
- 使用者只是提出問題，沒有證明能解釋這兩個區別；不記為 Learning Record。

## 進度與後續教學
- 7 階段、14 堂主線規劃；截至 2026-11-07 已寫 Lesson 01–04，無任何一堂已完成理解或實作驗收。
- 最近的研讀焦點在 Phase 02／Lesson 03；這代表學習位置，不代表 L01／L02 已掌握。
- L03 / L04 之後視觀念驗收結果補最小 bridge，不以往返對話用字直接當 Lesson 標題。

### SonarQube main vs. GitHub default branch（2026-11-08）
- 使用者正確指出 SonarQube Main Branch 與 GitHub Default Branch 是不同層級概念；教材應避免把「免費版只支援主分支」寫成「只能掃 SCM Default Branch」。
- 此訊息能顯示學習者已形成合理假設，但未有實際分析歸屬的操作證據；不將此記為正式 Lesson 驗收完成。
- 在 Phase 03 教 Project 時，要以 CI Checkout → Scanner → Project Key → Main Branch 的模型逐層教學，示範重複 Project Key 掃不同 Branch 的覆寫風險。

### Git 工作目錄中的 Commit vs Branch label（2026-11-08）
- 教學需先建立：Scanner 讀取 checkout 後工作目錄的內容；GitHub push workflow 的 actions/checkout 預設取事件 SHA，未必存在名為 main 的本地分支（detached HEAD 合法）。
- `fetch-depth: 0` 是取得完整 Git History 以支援 SCM 資料，不是設定分析分支。
- 在 L03 保留最小實例與反例，避免將 GitHub main、SonarQube Main Branch、checkout 動作與 SHA 混為一談；不依提問推論學習者已完成 Lesson。

### L03 對話所暴露的知識依賴（2026-11-08）
- 已能在問答中正確判斷：同 Project Key、未提供獨立分支／PR 身分，Checkout 改成別的 Branch 時，Dashboard Main Branch **名稱不自動改，分析狀態被更新**；能區分 Scanner 提交與 Server Compute Engine 完成。
- 後續仍需鞏固的依賴：CI Trigger vs Checkout SHA vs Scanner 工具 vs 分析身分（Project Key／Branch／PR）vs Server 儲存模型；Project 的建立與命名；同 Repo 多 Project 是獨立追蹤而非原生 Multi-Branch。
- 追加概念：為何 PR Analysis 不是僅掃最後一個 Commit；來源與目標 Branch 同時前進時，PR New Code Gate 不等於合併結果測試。GitHub pull_request **預設模擬 merge Checkout** 要與商業版 SonarQube PR Analysis 的「來源分支差異檢查」分開。
- Scanner 是 Runner 上執行的分析程式，不是 Pipeline／Runner／Pod 的別名；Community 與商業版掃描都以外部 Scanner 發送報告，不是商業版才由 Server 主動掃 GitHub。
- 測試匯入要分 Coverage、Test Execution、E2E 詳細報表、壓測效能指標；Scanner 不負責產生測試結果或負載測試 Dashboard。
- 教學處置：L03 補短橋接及推導情境；長參數／格式移至 `reference/0003-analysis-identity-and-test-data.html`；可追溯事實在 `sources/evidence/2026-11-08-analysis-identity-and-test-data.md`。
- **驗收界線**：這段對話有局部理解作答，但未完成跨情境、無提示的獨立應用／真實分析結果查驗，因此不將整個 L03 或 Course Map 標記為已完成。未向公開 GitHub Pages 放入私有 PoC hostname、Token、公司內部 Workflow。

### Lesson 03–04 互動驗收與 New Code / Gate 缺口（2026-11-09）
- L03：使用者正確推導 checkout develop + 同一 projectKey → Project Main Branch 分析結果；能設計依 branch 選不同 Project Key 以在 Community Build 獨立追蹤，並能區分付費版原生多分支。尚未完成完整 L03 無提示驗收，不宣稱完成。
- L04：使用者知道 Rule 開啟才能持續偵測 Issues，也能推導 Scanner 上傳後 Server 背景處理、Quality Gate wait 的必要性；但曾將「既往不咎」誤解為停用 Quality Profile 中的 Rule，並將「CI 不阻擋」誤解為應讓 Quality Gate PASS。
- 明確需要橋接：New Code Definition 四種模式（Previous version、Number of days、Specific analysis、Reference branch）、Specific analysis 需透過 Web API 設定、Quality Gate 本身的 PASS/FAIL 與 CI Job/Deployment 阻擋是獨立決策；sonar.qualitygate.wait 預設 false、timeout 預設 300 秒，也可用獨立 Quality Gate Check Action。
- 下一輪應要求使用者自行選擇「固定既往不咎基準 + New Code Gate + Non-blocking CI」的具體設定，確認能推導後才更新 Learning Records 和完成率。
- 官方依據：https://docs.sonarsource.com/sonarqube-community-build/project-administration/adjusting-analysis/configuring-new-code-calculation ；https://docs.sonarsource.com/sonarqube-community-build/analyzing-source-code/analysis-parameters/parameters-not-settable-in-ui ；https://docs.sonarsource.com/sonarqube-community-build/devops-platform-integration/github-integration/adding-analysis-to-github-actions-workflow

### L04 教學依賴與理解狀態（2026-11-09）
- 會話中已有正確口頭判斷：停用 Rule 就不產生該 Rule 的新 Issues；Gate 是多個條件的集合、任一不過即 FAIL；Gate FAIL 不必然讓 GitHub Actions Fail。但尚未完成無提示的跨情境應用與實機驗收，不標為 Lesson 完成。
- 需要明確拆解：官方 Rules 庫 vs 官方內建 Profile vs 自訂 Profile；Rule 的檢查邏輯 vs Metadata vs 註冊 vs 啟用；XPath Template vs Java Plugin vs External Analyzer 的 Issue 匯入。
- Standard 的 Bug / Code Smell Type 與 MQR Software Quality（Security、Reliability、Maintainability）及對應 Severity 不能混用。UI 模板型 Custom Rule 的 Metadata 設定，與 Plugin 定義／Profile Override 並不相同。
- 政策必須分成固定導入基準（New Code Definition）、每次 Commit 觸發分析（CI Trigger）與是否阻擋下個 Job（Quality Gate / CI）。固定導入基準可以與持續掃描共存；不應每次移到上一 Commit。
- 對現行 Community Build 的 Specific analysis，官方要求透過 Web API 設定，不能在 Project UI 直接選取；不能把指定未來時間／Git SHA 說成既有分析。Coverage 缺失不是所有情況必然 Gate FAIL，需考慮適用指標與 Fudge Factor。
- L04 已據此加入最小主線橋接、第二道理解題、Reference 0004 與官方 Evidence；保留目前學習完成數，直到有足夠的獨立驗收證據。

### Release Tag、Previous Version 與 Phase 04 跳讀需求（2026-11-09）
- 使用者將 Git Tag 作為正式發布版本；每次 Release Tag Scan 傳入 sonar.projectVersion 合理，為的是 Activity／版本追蹤而非保證 git diff。版本更新事件與 New Code Definition 應拆開。
- 重大教學修正：官方 Previous Version 起點為「目前版本首次分析的日期」；若只在 Release Tag 當天首次送新版本，不能宣稱已測到相鄰兩個 Release 的完整變更。Number of Days 起點為現在減 N 日，不該再宣稱一定選某一筆歷史分析當比對 Git Commit。
- Edge Case：上一個 Release 未修 Issue 可能離開後續版本 New Code Period，但仍屬 Overall Code；固定 Specific Analysis 與每版重新起算的治理政策不同。
- 新增 Reference 0005（完整 Release 時間線）／0006（Community 與付費版）；Phase 04 L07／08 已提供獨立教學與實驗流程。Phase 03 L05／06 只暫緩撰寫，尚無本次資料顯示已完成正式驗收。
- 請勿把新寫完的實驗流程等同於已實測；Learning Records 的通過資格未改變。

### Phase 05 教材準備（2026-11-09）
- 依請求續寫 Phase 05（Lesson 09、10），不因教材已撰寫而推論 L07／08 已通過。Phase 03 L05／06 仍暫緩。
- L09 教學應先依因果關係拆開 Event、Checkout SHA、Project Key、Project Version、New Code；Community 沒有原生 PR／Tag 分支；選主分支或 Tag 唯一權威 Trigger，避免錯 SHA、重複掃描、較舊 Tag 覆寫 latest dashboard 造成誤判。
- L10 治理需分 Gate FAIL、Scanner／TLS／Token Fail、CE FAILED／Timeout、錯版本資料。Observe 保留真實紅燈，Blocking 透過 wait/Quality Gate Check + needs/if 連接到 Deploy。例外必須核准且可追溯，不可永久全體 continue-on-error。
- 新增 Reference 0007 事件、Status、失效與證據欄位；官方核對來源見 `sources/evidence/2026-11-09-phase5-governance.md`。正式驗收與實機 QA 仍未完成，0/14。

### Phase 06 教學約束（2026-11-09）
- 新 Lesson 先講 Compute Engine（CE）、Elasticsearch（ES）與 PostgreSQL 的資料所有權，再引入 Helm/PVC。使用者曾明確要求解釋 CE，縮寫必須先展開。
- Official Community Helm Chart：26.2 移除 PostgreSQL dependency；`persistence.enabled` 主要是 ES Index，不是 DB Backup；ArgoCD-based deployment 官方未 fully supported／validated。
- 重建 Pod、重建 ES、還原 DB、回退 Helm Chart 是不同操作；DB Schema Migration 不可只靠 Helm Rollback 回復。
- Phase 05 與 06 已寫完，不表示使用者已通過；Phase 03 暫緩，進度 0/14。

### Phase 07 來源與教學要求（2026-11-09）
- 多語言導入：先講 Java Bytecode／JaCoCo、TypeScript／LCOV 的前置，再談 Rule、Profile 與跨語言比較；避免以 Raw Issue Count 或 Scanner SUCCESS 誤判。
- 共用模板把 Repo 的 Build／Test／Coverage 輸入與平台的 Project Key、SHA、Token、Gate Policy 分開；Project Analysis Token 優先，需檢查 Default Visibility 和 Global Execute Analysis。
- 需有明確 Rollout Metrics、False Positive Owner、Outage/Timeout 行為、Canary 與回退；新教材只能稱已撰寫，不是已執行 Pilot。
- Phase 07 L13、L14、Reference 0009 和 Evidence 已新增。Phase 03 L05／06 仍暫緩，正式驗收維持 0/14。
