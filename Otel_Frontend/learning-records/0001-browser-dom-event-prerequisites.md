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

## Bridges established in this session

以下內容已經被明確解釋並建立 reference，但**尚未把它標記為 mastered**；後續需要透過實際解釋或題目確認 retrieval：

- HTML source text ≠ DOM objects ≠ rendered pixels。
- `document` → current `Document` object → DOM tree。
- `Document` / `Element` 可以作為 `EventTarget`。
- `addEventListener()` 建立 listener registration；callback 是其中被保存並等待呼叫的函式。
- Browser event path 可用 capture → target → bubble 理解。
- `event.target` 與 `event.currentTarget` 責任不同。
- JS 不 polling click；browser dispatch event 時呼叫 callback。
- Browser Event object 不等於 Faro telemetry record。
- 在此脈絡中，dispatch 採用翻譯「**分派**」，避免誤解為網路傳送。

## Durable references created

- `reference/0001-dom-document-event-dispatch.html`
  - DOM object model
  - `document`
  - listener registration
  - event creation / dispatch / propagation
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

目前應視為：**已建立更具體的瀏覽器事件模型，但尚未證明能獨立重建整條因果鏈。**

未來教學不要直接假設 browser primitives 已熟練；若再次遇到 `document.addEventListener(...)`、`event.target`、callback 等語法，優先要求 learner 用自己的話指出：

- 哪一個是 DOM object？
- 哪一個東西被事先保存？
- event 是誰建立？
- callback 是誰呼叫？
- event object 怎麼進到 callback 參數？

若能穩定回答，再把這條 prerequisite branch 視為已內化。

## Teaching preference learned

這次對話顯示：遇到新的 frontend/browser 基礎概念時，先給「具體物件、誰持有、誰呼叫誰、資料何時建立」的因果模型，再給抽象名詞。不要用「JS 抓到 event」這類方便但模糊的擬人化描述。

## Return to main path

下一步不繼續擴張 DOM 教材。回到 Faro 主線：

`browser click → native Event / listener callback → Faro ClickInstrumentation 接手 → 讀取 target/context → 建立 Faro telemetry`

下一個主題只有在 learner 能把 native browser event 與 Faro telemetry 的邊界分開後，才進入 ClickInstrumentation。
