# Learning-from-docs 稽核與修正紀錄 — 2026-11-07

## 稽核基準
- Canonical Skill：`c0004512000/Skills` → `Learning/Learning-from-docs/SKILL.md` (`main`)，並依序閱讀 pinned upstream teach、OPTIMIZED-DELTA、LEARNING-MAP、TEACHING、PRESENTATION、technical-sre。
- 附加檢查：upstream MISSION-FORMAT、RESOURCES-FORMAT、LEARNING-RECORD-FORMAT、GLOSSARY-FORMAT。
- 範圍：`SonarQube/` 除 CSS 之外的教材、資料來源、學習地圖、互動檢查、來源與 Learning Records。
- 不把此頁的檢查當成學習者驗收或真實 SonarQube 實驗。

## 發現與處理
1. **Mission 格式與狀態混淆** — `MISSION.md` 改用 Why / Success looks like / Constraints / Out of scope；將目前教學位置與版本演進移至 `NOTES.md`、Course Map。
2. **來源分類及證據追蹤不足** — `RESOURCES.md` 改為 Knowledge / Wisdom / Gaps；`sources/linked/external/sonarsource-docs.md` 明列來源用途；新增 `sources/evidence/2026-11-source-matrix.md` 連結 14 堂來源與驗收。
3. **Course Map 不足以評估能力** — 7 個 milestone 保持不變，14 堂均有目的、具體預期成果、可觀察的驗收與官方來源；分清已撰寫和已驗收，指出目前研讀焦點 Phase 02 / Lesson 03。
4. **Learning Record 越權宣稱** — 移除 2 筆由提問產生、尚無已掌握證據的 Learning Record；將僅屬教學診斷的資訊整理至 `NOTES.md`。原歷史仍留在 Git commit history，不抹除使用者提問；正式紀錄目前 0 筆。
5. **教材前置概念及修訂自主性** — Lesson 02 在使用 SonarQube Project 前先作最小解釋；Lesson 03 從 Runner 執行與 Server 分支分析歸屬重新建立區別，避免只是把使用者原疑問換成標題。
6. **認知負荷過高** — Lesson 04 的 MQR／Standard 版本差異移入補充閱讀，核心 Lesson 保留 Rule → Quality Profile → Issue → Quality Gate；不在主線中硬塞非必需深度。
7. **Quiz integrity** — 全四堂選項各自等字元長度，答案位置 A / C / B / A；題目仍需根據內容判斷。新增無 JS 時可展開的解析，互動按鈕在 JS 啟動後才解禁。
8. **Lesson → Reference → Lesson 往返** — 概念速查提供回四堂 Lesson 的明確路徑，並註記速查不代表學習者已掌握 canonical Glossary。
9. **互動與工具證據** — Lesson 04 的概念模擬明示非 SonarQube 實測；JS 停用時 Select 不會作出虛假的互動承諾。
10. **架構圖語意** — 修正首頁與 Lesson 02 對 Compute Engine、Database、Web Dashboard 的箭頭及圖說，不再讓人誤以為 CE 直接將結果推送到一台獨立 Dashboard。

## 已執行的靜態檢查
- GitHub Repository 內 `SonarQube/` 檔案存在：四堂 Lesson、學習地圖、首頁、參考頁與來源檔。
- 每堂單一 `h1`、本地連結與章節錨點、來源連結文字、Quiz 原始 HTML 結構及正解位置有檢查。
- 四堂 Quiz 之選項字元長度分別為 `13/13/13`、`13/13/13`、`15/15/15`、`13/13/13`，正解 `A/C/B/A`。
- 有 JavaScript 的單選回饋與 Gate 模擬程式碼已檢查狀態更新依賴；無 JS 回退文案已加入。這是靜態審查，不是實際點選測試。

## 尚未完成（不得宣稱合規驗收完成）
- **正式瀏覽器 QA 未完成**：本次環境無法解析 `c0004512000.github.io` DNS，外部頁面檢視也無法訪問，因而不能實際使用 Playwright 測試部署後的桌機、手機 viewport、連結、測驗、互動及 HTTP 4xx / 5xx。
- 尚未有可驗證的 SonarQube UI、Workflow 與 POC 實驗證據。正式實驗課程只能在有核准環境與真實觀察時再補 screenshot。
- 目前沒有學習者理解驗收資料；完成率應保持 `0/14`。

## 後續 QA 驗收條件
1. 檢查 Pages 對本次 Commit 的部署結果與站點 URL。
2. 在 390px 手機及 1280px 桌面 viewport 開啟 index、map、L01–L04、reference；無水平 overflow。
3. 實際點選各頁課程連結、返回連結、主題切換、四題判斷回饋和 Rule/Gate 互動。
4. 確認相關頁面與資源 HTTP 不為 4xx / 5xx，所有可見 UI 無空按鈕。
5. 若日後補 UI 操作課：先在真實 POC 環境以 Playwright 截圖、遮蔽私密資訊，並提供紅框定位與實測邊界，不使用仿製截圖冒充證據。
