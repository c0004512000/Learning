# Learning Record 0001 — Browser DOM / Event prerequisite branch

Date: 2026-09-10

## Mission connection

這次不是另開一門 Frontend 基礎課，而是因為閱讀 `source-documents/3. Faro-Click-Tracking Introduction (for developer).html` 時，瀏覽器原生事件模型成為理解 Faro click tracking 的必要前置知識。

主線仍是：接手 Faro 前端監控方案，能理解、驗證與維運從 browser event 到 telemetry backend 的資料流。

## Workspace / skill rule

這個 project 的正式學習環境為 repo `Learning` 下的 `Otel_Frontend/`。

後續本 project 內的 learning session：

- 以 `Otel_Frontend/` 作為教材、learning map、reference、learning records 與 source documents 的 durable 記錄環境。
- 教學流程遵循目前指定的 `Learning-from-docs` learning workflow；不能只在聊天中回答後讓重要修正消失。
- Learner 的追問若證明教材造成錯誤心智模型、知識順序不合理或出現新的關鍵 prerequisite gap，先判斷應修主 lesson、reference 還是 learning record，再回寫 repo。
- 不因一次追問把所有延伸知識塞進目前 lesson；但首次使用某個必要名詞前，必須先提供足以理解它的最小 prerequisite。

## What exposed the prerequisite gap

本次對話實際暴露的卡點會影響後續教學，因此記錄進 ZPD：

1. **DOM 過度抽象，且「DOM JavaScript 物件」措辭造成新的錯誤模型**
   - Learner 已知道 DOM 是瀏覽器負責，因此「DOM JavaScript 物件」會被理解成 DOM 又變成 JavaScript 自己建立／持有。
   - 更精確的 bridge：DOM object 是瀏覽器建立與管理；JavaScript 透過 browser 提供的 DOM API 取得 object reference 並操作。
   - `HTMLButtonElement` 應解釋為按鈕 DOM object 對 JavaScript 暴露的介面／型別，不應導向不存在的「HTML object」概念。

2. **範例 selector `#schedule` 被重複使用卻未定義**
   - Learner 不知道 `#schedule` 是 selector，而非 DOM / Faro 的特殊語法。
   - 必須先說明 HTML `id="..."` 是作者給 element 的識別名稱；selector `#xxx` 表示找 id 為 xxx 的 element。
   - 後續範例改用語意較清楚的 `id="daily-schedule"`，並在首次出現 selector 時解釋 `#`。

3. **DOM tree 視覺化造成平行關係錯覺**
   - 使用多張具有不同 margin 的卡片表示 Document / html / body / main / button，在手機上不只容易 overflow，也讓 learner 誤判成彼此平行。
   - 父子關係應優先用單一 tree diagram 或明確 connector 顯示，不以單純縮排卡片暗示 hierarchy。

4. **Event lifecycle 不清楚**
   - 需要拆清楚：使用者輸入如何被瀏覽器接收、如何判定 target、何時建立 Event object、如何 dispatch、如何找到 listener、如何呼叫 JavaScript。
   - target 不是 Event 的 creator。click 的輸入來源是使用者／裝置，Event object 由 browser 建立，target 是 browser 判定此次 event 指向的 DOM object。

5. **`event.target` 命名邏輯需要第一性原理解釋**
   - Learner 對 target 的直覺是「event 要對 target 做什麼」，因此需要明確修正。
   - `event.target` 回答「這次 event 最初是朝哪個 DOM node 分派／發生於哪個 DOM node」。
   - `triggerer` 反而可能錯誤暗示 DOM element 主動創造 event，因此不適合作為心智模型。

6. **Bubbling / capture 被在定義前直接使用**
   - 這違反 prerequisite-first 的學習順序。
   - 後續順序必須是：先建立 target → 解釋 bubbling（target 往祖先）→ 再解釋 capture（祖先往 target）→ 最後才介紹 `capture: true`。
   - `capture: true` 只是 listener registration option，代表 listener 要在 capture phase 執行；不是 click tracking 的必要設定。

7. **「JavaScript 抓 event」這個說法造成錯誤心智模型**
   - 更精確的模型是：JavaScript 先登記 callback；瀏覽器之後在 event dispatch 時主動呼叫 callback，並把本次 Event object 傳入。

8. **`document` 名詞需要具體 referent**
   - `document` 應理解成 JavaScript 取得目前 HTML document 所對應 `Document` object 的全域入口，而不是泛稱「文件」或 documents 清單。

9. **Callback 缺乏控制流程模型**
   - 需要先區分 `handleClick`（函式本身）與 `handleClick()`（現在呼叫）。
   - Callback 應理解為角色：函式被交給另一方，再由接收方決定何時呼叫。
   - `back` 是相對於最初控制方向：程式先把函式交出去，接收方之後再 call back 進提供的函式。

## Bridges established / being repaired

以下內容已建立或依 learner feedback 重新修正，但**尚未標記為 mastered**：

- HTML source text ≠ DOM objects ≠ rendered pixels。
- DOM object 由 browser 建立／管理；JavaScript 透過 DOM API 取得 reference。
- `HTMLButtonElement` 是按鈕 DOM object 的介面／型別名稱。
- HTML `id="daily-schedule"` 與 selector `#daily-schedule` 的對應。
- `document` → current `Document` object → DOM tree。
- `Document` / `Element` 可以作為 `EventTarget`。
- browser 收到 user input → 判定 target → 建立 Event → dispatch。
- `event.target` 不是 creator，而是 event 最初指向的 DOM target。
- bubbling：target → ancestors。
- capture：ancestors → target。
- `capture: true`：listener 在 capture phase 執行。
- `event.target` 與 `event.currentTarget` 的責任差異。
- `addEventListener()` 建立 listener registration；callback 是其中被保存並等待呼叫的函式。
- JS 不 polling click；browser dispatch event 時呼叫 callback。
- Browser Event object 不等於 Faro telemetry record。
- 在此脈絡中，dispatch 採用翻譯「分派」，避免誤解為網路傳送。

## Durable references

- `reference/0001-dom-document-event-dispatch.html`
  - 已依本次 learner feedback 重寫：browser ownership vs JS access、selector、DOM tree、event target、bubbling、capture、`capture: true`、target/currentTarget。
  - 手機版不再用多層縮排卡片表達 DOM hierarchy。

- `reference/0002-callback-function.html`
  - callback 的角色
  - `handleClick` vs `handleClick()`
  - call back 命名邏輯
  - callback vs event vs listener registration
  - callback 不等於 async
  - Python 對照

## Current ZPD

目前應視為：**browser DOM / event prerequisite 仍在建立中，不能直接回到 Faro ClickInstrumentation。**

下次 retrieval 應優先確認 learner 是否能用自己的話回答：

- DOM 是誰建立、誰持有？JavaScript 為什麼又可以操作它？
- HTML element、DOM object、`HTMLButtonElement` 三者怎麼對應？
- `#daily-schedule` 裡的 `#` 和 `daily-schedule` 各是什麼？
- click Event 是誰建立？target 是誰判定？
- 為什麼叫 `event.target`，而不是 triggerer？
- bubbling 是哪個方向？為什麼 document listener 能收到 button click？
- capture 是哪個方向？`capture: true` 改變的是什麼？
- callback 是誰呼叫？event object 怎麼進到 callback 參數？

若這些能穩定重建，再回到 Faro 主線。

## Teaching preference learned

遇到新的 frontend/browser 基礎概念時：

- 優先給「具體物件、誰建立、誰持有、誰呼叫誰、資料何時建立」的因果模型，再給抽象名詞。
- 一個必要名詞第一次出現時必須當場定義；不得先在圖、code 或結論中使用，幾節後才補解釋。
- 圖像必須忠實表達關係；不能只靠視覺縮排讓 learner 自己猜 hierarchy。
- 手機是主要閱讀場景之一，任何 hierarchy、table、code block 與 callout 都要避免橫向 overflow 或因縮排造成內容被擠壓。
- 不使用「JS 抓 event」這類方便但模糊的擬人化描述。

## Return to main path

等這條 prerequisite branch 通過 retrieval 後，再回到：

`browser click → native Event / listener callback → Faro ClickInstrumentation 接手 → 讀取 target/context → 建立 Faro telemetry`
