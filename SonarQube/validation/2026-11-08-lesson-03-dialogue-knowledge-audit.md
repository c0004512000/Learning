# Lesson 03 對話知識缺口修訂稽核（2026-11-08）

## 任務與方法
- 依 `Learning-from-docs` canonical SKILL.md、pinned upstream、optimized delta、course map、teaching/presentation 與 technical-SRE 偏好執行。
- 診斷輸入：Learner 對 CI Trigger、checkout、Project/Main Branch、Scanner、Branch/PR analysis、Quality Gate 與外部測試資料提出的釐清；不是直接照逐字對話搬運成 Lesson。
- 完成採「前置依賴 → 來源事實 → 可應用情境 → 檢查」路徑；正式 Lesson 不依賴原對話即可獨立閱讀。

## 改動
- `lessons/0003-community-build-boundary.html`：補完整 Scanner → Server → Dashboard 因果鏈；分析身分／參數矩陣；Checkout／GitHub PR 模擬 merge 邊界；同 Repo 多 Project；Project 建立與 Main Branch 命名；PR 與 Branch 分析用途區別；PR New Code 與整合結果測試分離；測試報告匯入的最小橋接；排除不適合公開的內部工作流程敘述。
- `reference/0003-analysis-identity-and-test-data.html`：整理 Scanner 執行型態、Branch／PR 身分、Project 建立、PR Checkout／target 比較、Coverage/Test Execution、E2E 與壓測指標。
- `sources/evidence/2026-11-08-analysis-identity-and-test-data.md`：保存可查核的 SonarSource／GitHub 官方依據、功能版別對照及未實證限制。
- `reference/0002-glossary.html`、`RESOURCES.md`、`README.md`、`learning-map/index.html`：加入術語、來源與 Lesson ↔ Reference 回返連結。
- `NOTES.md`：保存診斷與局部理解證據，不擴大為整堂 Lesson 已通過。

## 特別修正的事實邊界
1. 官方功能表的 SonarQube **Community Build** 與 **SonarQube Cloud Free** 欄位不可混淆：Cloud Free 對 PR 的限定能力不等於 Community Build 支援 PR Analysis。
2. `pull_request` 事件預設的 GitHub 模擬 merge Checkout，不是 SonarQube PR Analysis；來源 branch HEAD checkout 是另一個明確選擇。
3. 一般主分支分析沒有獨立 Branch／PR 身分時會指向 Project Main Branch；**不能**把「在任意事件觸發」誤說成「一定成功」，因為認證、Checkout、環境等仍可能失敗。
4. 明確使用不支援的 PR／Branch 分析身分不能被描述成可安全新增獨立狀態；未實測版本的精確錯誤訊息不能編造。
5. 新程式碼品質 Gate 不等於自動合併最新 base/head 後的整合保證；E2E/壓測報告亦須與 Coverage 指標區隔。

## 驗證與限制
- GitHub Connector 成功寫入並再讀取更新後的 Lesson、Reference、Glossary、Map。
- 靜態 HTML tag-stack 檢查：以上三份 HTML 的開閉標籤配對均無錯誤。
- 從上述頁面抽取 12 個唯一的站內相對連結，均可在 Repository 以 GitHub Connector 找到。
- 在變更後的 Lesson／Reference／Glossary／Map 未發現特定私有 Hostname、Repo 名、內部環境 Workflow 範例。
- **未完成**：實際 GitHub Pages 部署後的 Playwright 桌面及手機操作、渲染與互動 QA；本回合外部站點無法正常讀取。未觀察或截取真實 SonarQube／CI 掃描。
- Lesson 03 並未因本次補充自動標記為學習完成；正式驗收需使用者無提示地推導不同事件、來源 SHA 與參數組合。
