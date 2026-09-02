# HTML → GitHub Pages 標準交付 Prompt

> 用途：當需要把學習文件、技術教材、知識頁面或其他 HTML 內容整理後上傳到 GitHub Pages 時，直接使用這份 Prompt。

---

## Prompt

我要你把目前這批內容整理成可直接放到 GitHub Pages 的 HTML 文件，並完成實際交付與驗證。

請把這件事當成「網站內容交付」而不是單純「產生幾個 HTML 檔案」。你必須同時處理內容品質、資訊架構、HTML/CSS/JS、跨頁導航、GitHub Pages 路徑，以及上線後驗證。

### 1. 先理解內容，再決定頁面結構

不要先照輸入檔案順序機械式轉成 HTML。

先判斷：

- 哪些內容是主線教材；
- 哪些是延伸說明、reference、FAQ、appendix；
- 哪些內容應合併；
- 哪些內容應拆頁；
- 每頁真正要回答的核心問題是什麼；
- 使用者應該依什麼順序閱讀。

如果內容本身已有明確章節順序或使用者指定順序，必須尊重它，不要自行重排成反直覺順序。

### 2. 檔名編號必須等於閱讀順序

如果使用數字前綴，數字就是正式閱讀順序。

例如：

```text
00-start-here.html
01-topic-a.html
02-topic-b.html
03-topic-c.html
```

那首頁、上一頁 / 下一頁、章節清單、底部導覽都必須維持：

```text
00 → 01 → 02 → 03
```

禁止出現檔名是 `01 / 02 / 03 / 04`，但頁面內推薦閱讀順序卻跳成 `01 → 03 → 02 → 04`。

如果教學邏輯真的需要不同順序，先重新命名檔案，讓編號與閱讀順序一致。

### 3. 保持內容本身的教學品質

HTML 不是把 Markdown 套皮而已。

每一頁至少要有：

- 明確標題；
- 本頁要回答的問題；
- 概念解釋；
- 必要時的例子；
- 必要時的圖解 / 流程；
- 與前後章節的關係；
- 可以實際帶走的結論。

不要建立只有幾句空泛描述、卻被命名為 `reference`、`deep dive`、`architecture` 的頁面。

如果某個 reference 頁存在，它必須真的補充主線頁不適合塞入的細節，例如：

- 底層資料流；
- 實際 query；
- API / config；
- metric / label；
- runtime evidence；
- debug 方法；
- edge cases；
- 延伸閱讀。

Reference 頁不能只是重複主線內容。

### 4. Reference 必須是「真的可以跳轉」

如果頁面之間存在 reference 關係，請用標準 HTML link / anchor 實作。

跨頁：

```html
<a href="02-query-layer.html#datasource">查看 Datasource Reference</a>
```

同頁：

```html
<a href="#runtime-flow">跳到 Runtime Flow</a>
```

目標位置：

```html
<section id="runtime-flow">
```

如果主線頁連到 reference 頁，reference 頁也應提供合理的「回主線」方式，而且最好回到原本離開的位置，而不是永遠回頁首。

例如：

```html
<a href="01-main-topic.html#after-reference">回主線</a>
```

只要使用相對路徑，同一個 GitHub Pages directory 內就能互相 reference，不需要額外 server-side 設定。

### 5. 所有導航都必須有真正的 `<a href>` fallback

不要只靠 JavaScript click handler。

錯誤示範：

```html
<div onclick="goNext()">下一頁</div>
```

正確方向：

```html
<a href="02-next.html" class="nav-card">下一頁</a>
```

JavaScript 可以加強體驗，但不能成為唯一導航方式。

即使 JavaScript 沒執行，以下功能仍應可用：

- 上一頁 / 下一頁；
- 首頁章節入口；
- reference link；
- anchor 跳轉；
- 回主線；
- 目錄。

### 6. GitHub Pages 一律優先使用相對路徑

避免把 repository name、domain 或 deployment path 寫死在 HTML。

優先：

```html
<a href="01-topic.html">
<link rel="stylesheet" href="assets/style.css">
<script src="assets/theme.js"></script>
```

避免：

```html
<a href="https://example.github.io/Learning/Observability/Stage/01-topic.html">
```

除非有明確理由需要 absolute URL。

這樣同一批 HTML 才能同時在：

- local filesystem；
- local HTTP server；
- GitHub Pages repository path；
- 未來搬目錄後

正常工作。

### 7. 共用樣式與共用 JS 不要每頁複製

如果有多頁，優先建立：

```text
assets/
  style.css
  theme.js
  navigation.js   # 若真的需要
```

所有頁面共用同一套 design system。

不要每頁塞一份巨大、略有差異的 inline CSS / JS，否則後續很難維護，也容易造成頁面行為不一致。

### 8. Mobile-first

這批 GitHub Pages 可能大量在手機上閱讀，因此請優先驗證 mobile layout。

至少確認：

- viewport meta 正確；
- 文字不需要橫向捲動；
- code block 可以水平捲動，但不能撐爆整頁；
- table 在窄螢幕可合理閱讀或水平捲動；
- button / link tap target 足夠；
- fixed / sticky 元件不遮住正文；
- Safari mobile bottom bar / top bar 不會讓主要控制項無法操作；
- heading 不會過大到造成單字一行；
- diagram 不會超出 viewport。

### 9. 互動元件必須有「真的可運作」的行為

如果頁面設計包含：

- quiz；
- accordion；
- tabs；
- theme toggle；
- interactive cards；
- show / hide answer；
- scroll-to-section；

就必須實際實作並驗證。

不要只把它畫得像按鈕。

如果互動不是必要，就寧可用普通 HTML link / details / summary 等原生功能，降低故障面。

### 10. 深色 / 淺色模式

如果有 theme toggle：

- 必須真的切換；
- 重新整理後應盡量保留使用者選擇；
- 所有文字、border、code block、link、callout 都要在兩種模式下有足夠對比；
- 不要只換 body 背景，其他元件仍留在錯誤顏色。

若沒有充分必要，不必為了炫技強行加入複雜 theme system。

### 11. 圖解優先服務理解，不為裝飾

如果有流程或架構圖，請確認順序正確。

例如資料流若實際是：

```text
Exporter → Backend → Datasource → Query → Panel
```

就不能因為排版方便畫成：

```text
Exporter → Backend → Panel → Query → Datasource
```

圖的視覺順序必須等於概念順序。

圖中每個箭頭都要有語意，不要只是裝飾線。

### 12. 上傳前必須執行靜態 QA

在 commit / push 前，逐頁檢查：

- HTML tag 是否完整；
- `href` 是否指向存在的檔案；
- `src` 是否指向存在的 asset；
- anchor target 是否存在；
- 是否有重複 `id`；
- 上一頁 / 下一頁是否正確；
- 首頁閱讀順序是否與檔名一致；
- reference 是否雙向合理；
- CSS / JS path 是否正確；
- 是否有明顯 placeholder；
- 是否有空白 section；
- 是否有死連結；
- 是否有 console-level obvious JS syntax error；
- 是否有把 secret / token / credential 寫進 HTML。

可以寫 script 自動掃描就不要只靠肉眼。

### 13. 必須做實際瀏覽器驗證

不要只檢查 source code。

至少實際打開：

- 首頁；
- 每一個章節頁；
- 每一個 reference link；
- 上一頁 / 下一頁；
- theme toggle（若有）；
- quiz / accordion / tabs（若有）。

至少驗證一個 desktop viewport 與一個 mobile viewport。

如果環境允許，使用 browser automation 做 smoke test。

### 14. GitHub Pages 部署後還要再驗一次

完成 GitHub commit 後，不代表工作完成。

需要確認：

1. GitHub Pages workflow 成功；
2. 實際 Pages URL 回傳正常；
3. 首頁可載入；
4. CSS / JS 沒有 404；
5. chapter link 可用；
6. reference + anchor 可用；
7. mobile rendering 正常。

特別注意 GitHub Pages 的 repository subpath。

Local 正常但 Pages 404，通常代表 path 寫錯；這必須在交付前被抓出來。

### 15. 不要宣稱沒有驗證過的功能已經正常

交付結果請明確區分：

- 已產生；
- 已靜態檢查；
- 已本地瀏覽器驗證；
- 已部署；
- 已從 GitHub Pages 實際驗證。

若某一步因工具或權限無法執行，直接說明，不要用「應該正常」替代測試。

### 16. 最終交付格式

完成後，請給我一個精簡的交付摘要，包含：

- 新增 / 修改哪些檔案；
- 正式閱讀順序；
- reference 關係；
- 做過哪些 QA；
- GitHub Pages deployment 狀態；
- 實際 Pages 入口。

不要只說「已完成」。

---

## 建議目錄結構

```text
<topic>/
├── 00-start-here.html
├── 01-....html
├── 02-....html
├── 03-....html
├── reference/
│   └── ...
└── assets/
    ├── style.css
    ├── theme.js
    └── navigation.js
```

Reference 不一定要獨立 directory；如果頁數少，也可以和主線頁放同一層。重點是 link 清楚、路徑穩定、資訊架構一致。

---

## Definition of Done

只有在以下條件都成立時，才算真正完成：

```text
[ ] 內容結構合理
[ ] 編號 = 閱讀順序
[ ] 所有 link target 存在
[ ] 所有 anchor target 存在
[ ] Reference 可來回
[ ] 無 JS 也能完成基本導航
[ ] Mobile layout 正常
[ ] 共用 assets 正常載入
[ ] 互動功能實際可操作
[ ] 靜態 QA 通過
[ ] Browser smoke test 通過
[ ] GitHub Pages deployment 成功
[ ] 線上 Pages 再驗證通過
[ ] 沒有 secret / token / credential 洩漏
```

未完成的項目必須明確列出，不得直接標示整體完成。