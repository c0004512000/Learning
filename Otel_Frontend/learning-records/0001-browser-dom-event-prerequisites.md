# Learning Record 0001 — Browser DOM / Event prerequisite branch

Date: 2026-09-10

## Mission connection

這次不是另開一門 Frontend 基礎課，而是因為閱讀 `source-documents/3. Faro-Click-Tracking Introduction (for developer).html` 時，瀏覽器原生事件模型成為理解 Faro click tracking 的必要前置知識。

主線仍是：接手 Faro 前端監控方案，能理解、驗證與維運從 browser event 到 telemetry backend 的資料流。

## What exposed the prerequisite gap

本次對話實際暴露的卡點會影響後續教學，因此記錄進 ZPD：

1. **DOM 過度抽象**
   - 單純說「DOM 是瀏覽器根據 HTML 建立的可操作頁面結構」仍不足以形成具體模型。
   - Learner 需要知道瀏覽器記憶體裡實際存在 `Document`、`HTMLButtonElement` 等物件，以及它們之間的 tree 關係。

2. **Event lifecycle 不清楚**
   - 需要拆清楚：使用者輸入如何被瀏覽器接收、如何決定 target、何時建立 Event object、如何 dispatch、如何找到 listener、如何呼叫 JavaScript。
   - 同時需要區分「listener registration 被保存」與「每次 Event object 並不自動成為永久歷史紀錄」。

3. **「JavaScript 抓 event」這個說法造成錯誤心智模型**
   - 更精確的模型是：JavaScript 先登記 callback；瀏覽器之後在 event dispatch 時主動呼叫 callback，並把本次 Event object 傳入。

4. **`document` 名詞沒有建立具體 referent**
   - `document` 需要被理解成目前 HTML 文件對應的 `Document` object，而不是泛稱「文件」或某個 documents 清單。

5. **Callback 缺乏控制流程模型**
   - 需要先區分 `handleClick`（函式本身）與 `handleClick()`（現在呼叫）。
   - Callback 應理解為角色：函式被交給另一方，再由接收方決定何時呼叫。
   - `back` 是相對於最初控制方向：程式先把函式交出去，接收方之後再 call back 進提供的函式。

6. **Capture / Bubble 被看成沒有理由的「來回走一次」**
   - Learner 追問「capture 是不是邊找邊執行」「相反就是 bubble 時才執行」「為什麼要區分」。
   - 需要修正：target 在 dispatch 前就已確定；capture 並不是拿來找 target。Event path 確定後，dispatch 按 phase 走 path，經過 EventTarget 時符合的 listener 會當下被 invoke。
   - Capture 是 ancestor → target 方向，處理 `capture: true` listeners；若 event 的 `bubbles` 為 true，之後才在 ancestor 反向順序處理 non-capture listeners。

7. **`bubble` / `bubbles` 缺乏語意模型**
   - Learner 不理解「bubbling phase」與「click 是會 bubble 的事件」。
   - 需要明確區分：bubble 是事件分派的一個 phase；`event.bubbles` 則是一個布林行為屬性，決定 target 之後是否沿 ancestors 反向執行 non-capture listeners。
   - 不應讓 learner 推論所有 DOM events 都會 bubble；是否 bubble 是 event type / initialization 定義的一部分。

## Bridges established in this session

以下內容已經被明確解釋並建立 reference，但**尚未把它標記為 mastered**；後續需要透過實際解釋或題目確認 retrieval：

- HTML source text ≠ DOM objects ≠ rendered pixels。
- `document` → current `Document` object → DOM tree。
- `Document` / `Element` 可以作為 `EventTarget`。
- `addEventListener()` 建立 listener registration；callback 是其中被保存並等待呼叫的函式。
- Event target 在 dispatch 前就已決定；capture 不是 target discovery。
- Dispatch 會沿 event path 執行，符合 phase/type 的 listener 會在 traversal 過程被 invoke。
- Capture：ancestor → target，處理 capture listeners。
- Target：處理 event target。
- Bubble：若 `event.bubbles === true`，再沿 ancestors 反向處理 non-capture listeners。
- 一般 `document.addEventListener('click', handleClick)` 預設 `capture: false`，因此對 descendant click，通常是在 bubbling 階段於 document 被呼叫。
- `event.target` 與 `event.currentTarget` 責任不同。
- JS 不 polling click；browser dispatch event 時呼叫 callback。
- Browser Event object 不等於 Faro telemetry record。
- 在此脈絡中，dispatch 採用翻譯「**分派**」，避免誤解為網路傳送；bubble 採「**冒泡**」，強調由內層 target 往外層 ancestors 的方向。

## Durable references created / expanded

- `reference/0001-dom-document-event-dispatch.html`
  - DOM object model
  - `document`
  - listener registration
  - event creation / dispatch / propagation
  - capture / target / bubble phase
  - `event.bubbles` 的語意
  - `event.target` vs `event.currentTarget`
  - 可操作的 event dispatch demo

- `reference/0002-callback-function.html`
  - callback 的角色
  - `handleClick` vs `handleClick()`
  - call back 命名邏輯
  - callback vs event vs listener registration
  - callback 不等於 async
  - Python 對照

## Current ZPD

目前應視為：**已建立更具體的瀏覽器事件模型，但尚未證明能獨立重建整條因果鏈，尤其 capture / bubble 的 phase 選擇仍是 active prerequisite。**

未來教學不要直接假設 browser primitives 已熟練；若再次遇到 `document.addEventListener(...)`、`event.target`、callback、capture/bubble 等語法，優先要求 learner 用自己的話指出：

- 哪一個是 DOM object？
- 哪一個東西被事先保存？
- event 是誰建立？
- target 在什麼時候決定？
- capture 是不是用來尋找 target？
- listener 在哪個 phase 被 invoke，取決於什麼？
- `event.bubbles` 控制的是哪一段？
- callback 是誰呼叫？
- event object 怎麼進到 callback 參數？

若能穩定回答，再把這條 prerequisite branch 視為已內化。

## Teaching preference learned

這次對話顯示：遇到新的 frontend/browser 基礎概念時，先給「具體物件、誰持有、誰建立、誰呼叫誰、資料何時存在」的因果模型，再給抽象名詞。不要用「JS 抓到 event」或「event 往上傳」但不解釋 phase / listener selection 的模糊描述。

當出現 capture / bubble 這種流程詞時，要先回答：

1. 這一階段開始前，哪些資訊已經知道？
2. traversal 方向是什麼？
3. traversal 時是否真的執行程式？
4. 哪一類 listener 會被執行？
5. 什麼條件決定有沒有這一階段？

## Return to main path

下一步不擴張成完整 DOM Events 課程。等 learner 能說清楚：

`target 已決定 → event path → capture listeners → target → (bubbles=true) ancestor non-capture listeners`

再回到 Faro 主線：

`browser click → native Event / listener callback → Faro ClickInstrumentation 接手 → 讀取 target/context → 建立 Faro telemetry`
