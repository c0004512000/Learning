# 2026-10-22 Learning integration review / QA

## Review scope

基準為原 main `6697df805490fac642889f67fea0bc9364401dfb`，先完整審查兩個 pending PR，再整合新增對話材料：

- **PR #37**：head `95ad7165ea62f39342c4717705f50448c68aca0a`。核對七檔完整 diff、Faro source assignment／override 順序與 Resource／propagation／Dashboard contract。已 merge 為 `7f9f898a83b7856eab346feb0402bee822dc8631`。
- **PR #24**：原 head `376e3180993683b55306b0ea8c0a0b8b294d8e00`。原 diff 與現有主線衝突；保留 current main，補回被簡化掉的 Browser prerequisite、重新使用 Reference 0009／Learning Record 0014，保留 Lessons 5–9 與 #37。解衝突 commit `94693dbd541e99dbb00e71cab72778c5ddac99a7` 以原 PR head 與最新 main 為 parents；non-force update，compare behind_by=0。已 merge 為 `21aa42f7f7271213e4ca573c9f1c6c6048796472`。

Standards 與 Spec 各自檢查；未聲稱由獨立 reviewer agents 平行審查。準則是 `c0004512000/Skills` 的 `Learning/Learning-from-docs/SKILL.md`（blob `a2241c8b7759bbdb241476a5638ba822efe679a4`）與其全部 Required context。Mission、Lesson 3 位置與未完成 retrieval 保持不變。

## 本次實際通過的檢查

| 檢查 | 結果 |
|---|---|
| 主／支線全部範圍與來源覆蓋 | 已讀兩份完整附件；逐項對照 evidence matrix；行政匯出往返不轉教材。 |
| 7 個新增／修訂 HTML 結構 | lang、唯一 IDs、實際 relative links、Reference 返回 anchors；無空白 href 控制。 |
| 20 題 self-check | 每題 4 choices、1 correct answer；retrieval 在 recap 前，沿用 shared quiz.js 隨機化。 |
| Shared assets | style.css、theme.js、mobile.css、quiz.js、code-highlight.js/css、evidence-annotations.css 的本機副本逐一核對 Git blob SHA，與 repo 完全相同。這些未修改的副本不納入 PR。 |
| JavaScript syntax | 三個既有 JS 以 node --check 通過。 |
| Chromium 記憶體渲染 | 7 頁 × 1440×1000／390×844，共 14 組；頁面／正文無橫向溢出。桌面正文寬 756 px（42rem），窄螢幕隨 viewport 收縮。 |
| Quiz 實際操作 | 20 題 × 正答／誤答 × 兩種尺寸，共 80 次 click；回饋存在、正誤 class 與按鈕鎖定均符合預期。12 次重新載入的正答位置非固定。 |
| Dark／light CSS | 兩種 data-theme 的 computed background 不同；這項不等於驗證 theme button／localStorage workflow。 |
| ID 離線核對 | 兩個 Base64 span IDs 正確轉成對話所列 hex；慢請求原字串長度確為 31。未猜補字元。 |

測試使用實際 authored HTML 與經 SHA 核對的共用樣式、quiz/highlighter 程式。因環境禁止 URL navigation，採 `page.set_content()` 記憶體渲染；移除外部 asset 載入標籤後嵌入同一份 CSS／quiz/highlighter。未注入假 Grafana 畫面、假 telemetry 或假 query response。

## 審查發現後修正

- 原 shared mobile safeguard 的 body max-width 可覆蓋桌面閱讀寬度。新增 opt-in `course-layout.css`，以 `body.learning-page` 限定本次修訂頁面；不任意覆寫其他舊頁的特殊佈局。
- Lesson 8 的舊手機規則會令 evidence frame／image 變成 62rem；改用 opt-in responsive figure，保留既有 desktop／mobile capture 的 picture source，沒有改圖或偽造 UI。
- Primary／side route、Reference 回程、map 的 planned 與 available 狀態分開；不因這次更新把 Lessons 10–12 提前產出。
- app.name 大小寫、Source 版本、事件日期、匯出日期與本次核查日期分開；原對話不足處保留 unknown。

## 尚未驗證的部分

**這不是已部署 GitHub Pages 的 production-ready 宣告。**

本機 Chromium 導向 HTTP 與 file URL 都回 `ERR_BLOCKED_BY_ADMINISTRATOR`；沒有解除限制。既有二進位截圖未能下載至本機，本次記憶體渲染不載入圖片。下列項目沒有假稱通過：

- 已部署網站桌面／手機的實際 navigation 與完整 HTTP 4xx／5xx 檢查。
- 既有 Grafana／DevTools 圖片的實際載入與畫面可讀性回歸。
- Theme button、localStorage persistence 與 JavaScript disabled 的 navigation。
- 所有未修改舊頁的瀏覽器回歸、內部 Grafana UI 或 telemetry runtime 重現。

圖片與未鏡像舊頁的連結依已讀 repository tree／原有 artifact 路徑核對；這與部署 HTTP 驗證不同。原有 Pages workflow 的舊成功 run 不能當成這次 commit 已部署的證明；合併後需另看與新 SHA 對應的 run。
