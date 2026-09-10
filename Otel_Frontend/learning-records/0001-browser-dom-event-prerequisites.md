# Learning Record 0001 — Browser DOM / Event prerequisite branch

Date: 2026-09-10

## Mission connection

這次不是另開一門 Frontend 基礎課，而是因為閱讀 `source-documents/3. Faro-Click-Tracking Introduction (for developer).html` 時，瀏覽器原生事件模型成為理解 Faro click tracking 的必要前置知識。

主線仍是：接手 Faro 前端監控方案，能理解、驗證與維運從 browser event 到 telemetry backend 的資料流。

## Workspace / skill rule

這個 project 的正式學習環境為 repo `Learning` 下的 `Otel_Frontend/`。

後續本 project 內的 learning session：

- 以 `Otel_Frontend/` 作為教材、learning map、reference、learning records 與 source documents 的 durable 記錄環境。
- 教學流程遵循目前 Skills repo `main` 的 `Learning-from-docs` workflow；不能沿用已被新版 Skill 取代的舊規則。
- Learner 的追問若證明教材造成錯誤心智模型、知識順序不合理或出現新的關鍵 prerequisite gap，先判斷應修主 lesson、reference 還是 learning record，再回寫 repo。
- 不因一次追問把所有延伸知識塞進目前 lesson；但首次使用某個必要名詞前，必須先提供足以理解它的 prerequisite。
- Durable lesson / reference 必須可 cold-read：不得依賴已刪除舊版本或 conversation history 才看得懂。

## What exposed the prerequisite gap

本次對話實際暴露的卡點會影響後續教學，因此記錄進 ZPD：

1. **DOM 過度抽象，且 DOM ownership 必須和 JavaScript access 分開**
   - Learner 已知道 DOM 是瀏覽器負責，因此把 DOM object 說成 JavaScript object 容易形成錯誤 ownership 模型。
   - 正確 bridge：DOM object 是瀏覽器建立與管理；JavaScript 透過 browser 提供的 DOM API 取得 object reference 並操作。
   - `HTMLButtonElement` 應解釋為按鈕 DOM object 對程式暴露的介面／型別，不應導向不存在的「HTML object」概念。

2. **範例 selector 必須在首次使用前定義**
   - Learner 一開始不知道 `#schedule` / `#daily-schedule` 是 selector，而非 DOM / Faro 的特殊語法。
   - HTML `id="..."` 是作者給 element 的識別名稱；selector `#xxx` 表示找 id 為 xxx 的 element。

3. **DOM hierarchy 必須被圖真正表達，而不是靠視覺縮排暗示**
   - 多張縮排卡片曾讓 learner 誤判節點彼此平行。
   - 父子關係應優先使用單一 tree / 明確 connector。

4. **Event lifecycle 必須拆成不同責任步驟**
   - 需要拆清楚：user input → browser receives → hit testing / target determination → Event creation → dispatch → listener invocation。
   - target 不是 Event creator。Event object 由 browser 建立；target 是 browser 對本次 event 判定的 DOM object。

5. **`event.target` 命名需要因果模型**
   - `event.target` 回答「這次 event 最初指向哪個 DOM object」，不是「誰觸發／創造 event」。

6. **Bubbling / capture 不可在定義前直接使用**
   - 後續順序：先知道 target/path 已確定 → 定義 phase → Capture → Target → Bubble → 才介紹 `capture` option。
   - Capture 不是 browser 邊走邊尋找 target；target/path 先確定，dispatch 才沿 path 呼叫符合條件的 listeners。

7. **`capture: true/false` 的語法理解已建立，但缺少 decision model**
   - Learner 已理解 true / false 代表不同 listener timing，但不知道什麼實際需求會讓工程師選 Capture 或 Bubble。
   - 後續教學必須從「需要在 descendant handler 前觀察／介入」vs「target 後再由 ancestor 處理」推導選擇，而不是只背方向。
   - `capture: false` 是預設，不應簡化成「Bubble 是預設」；listener 若本身位於 target，`capture: true` 或 `false` 都可能在 Target phase 執行。

8. **`event.eventPhase` 被 demo 在定義前直接暴露，是新的 prerequisite-order violation**
   - Raw `event.eventPhase = 1/2/3` 沒有先解釋 `phase` 與數字，違反「不要用未定義名詞解釋新概念」。
   - 必須先定義 phase = 同一次 dispatch 當下走到哪一段，再介紹 `eventPhase` 只是 runtime API 表示值。
   - UI 應優先顯示 `CAPTURE / TARGET / BUBBLE`，數字 1 / 2 / 3 只作 API 對照，不作主要學習內容。

9. **listener registration option 與 runtime event phase 必須嚴格分開**
   - `capture: true` 是 listener 事先登記的設定；`event.eventPhase` 是本次 event dispatch 當下的位置。
   - 如果一個 `capture: true` listener 所在物件恰好就是 event target，它會在 Target phase (`AT_TARGET`) 被呼叫，因此不能把 label 寫成「CAPTURE listener = eventPhase 1」。

10. **Tracing 提供了 Capture/Bubble 選擇的實際因果測試**
   - 如果 click telemetry 只想記錄「發生一次互動」，Capture / Bubble 主要差異可能是觀察時間、propagation 是否在到達 listener 前被停止，以及當下可見的狀態。
   - 如果 click Span 要成為後續 app work / HTTP Span 的 parent，必須在 downstream Span 建立前建立並正確傳遞 active context；較早的 Capture timing 有潛在必要性，但 Capture 本身不等於 context propagation。
   - 不能誤教成「只要 Capture 裡 startSpan，後面的 fetch 就自動變 child」。

11. **「JavaScript 抓 event」會形成錯誤控制流模型**
   - JavaScript 先登記 callback；browser 之後在 dispatch 過程中主動呼叫 callback，並把本次 Event object 傳入。

12. **`document` 必須有具體 referent**
   - `document` 是 JavaScript 取得目前 HTML document 所對應 `Document` object 的入口，不是泛稱文件。

13. **Callback 必須以控制方向理解**
   - 區分 `handleClick`（函式本身）與 `handleClick()`（現在呼叫）。
   - callback 是角色：函式先交給另一方，再由接收方決定何時 call back。

## Bridges established / being repaired

以下內容已建立或依 learner feedback 修正，但**尚未標記為 mastered**：

- HTML source text ≠ DOM objects ≠ rendered pixels。
- DOM object 由 browser 建立／管理；JavaScript 透過 DOM API 取得 reference。
- HTML `id="daily-schedule"` 與 selector `#daily-schedule` 的對應。
- `document` → current `Document` object → DOM tree。
- `Document` / `Element` 可作為 EventTarget。
- browser 收到 user input → 判定 target → 建立 Event → dispatch。
- phase = 同一次 dispatch 目前走到哪一段。
- Capture：target/path 已知後，外 → 內處理 capture listeners。
- Target：event 到達 target。
- Bubble：對允許 bubbling 的 event，target 後由內 → 外處理 ancestor non-capture listeners。
- `capture` registration option ≠ `event.eventPhase` runtime state。
- `capture: false` 是預設，但不等於 listener 永遠在 Bubble phase 執行。
- `event.eventPhase`: NONE / CAPTURING_PHASE / AT_TARGET / BUBBLING_PHASE；數字只是 API encoding。
- `event.target` 與 `event.currentTarget` 的責任差異。
- `event.bubbles` 表示是否允許 target 後的 ancestor bubbling flow。
- click 會 bubble，因此 document ancestor listener 可接到 descendant click。
- Trace parent/child 需要正確 active-context propagation；listener timing 只是其中一個條件。
- JS 不 polling click；browser dispatch event 時呼叫 callback。
- Browser Event object 不等於 Faro telemetry record。

## Durable references

- `reference/0001-dom-document-event-dispatch.html`
  - browser ownership vs JS access
  - selector / DOM tree / EventTarget
  - target determination / Event creation / dispatch
  - phase definition before `event.eventPhase`
  - capture vs bubble decision model
  - `capture` registration vs runtime phase distinction
  - tracing timing example and active-context caveat
  - mobile demo renders semantic phase names before raw numeric values

- `reference/0002-callback-function.html`
  - callback 的角色
  - `handleClick` vs `handleClick()`
  - call back 命名邏輯
  - callback vs event vs listener registration
  - callback 不等於 async
  - Python 對照

## Current ZPD

目前應視為：**browser DOM / event prerequisite 仍在建立中，不能把 Capture / Bubble 視為 mastered。**

下一次 retrieval 優先確認 learner 是否能用自己的話回答：

- DOM 是誰建立、誰持有？JavaScript 為什麼可以操作它？
- click Event 是誰建立？target 是誰判定？
- Capture 開始時 target 是否已經知道？
- phase 是什麼？`event.eventPhase` 又只是什麼？
- `capture: true/false` 是 registration setting 還是 runtime phase？
- 為什麼 `capture: false` 不等於「永遠在 Bubble phase」？
- 什麼需求會選 Capture？什麼需求通常選 Bubble / default non-capture？
- 如果要讓 click Span 成為後續 HTTP Span 的 parent，為什麼 timing 與 active context 都重要？
- callback 是誰呼叫？Event object 怎麼進到 callback 參數？

若這些能穩定重建，再回到 Faro 主線。

## Teaching preference learned

遇到新的 frontend/browser 基礎概念時：

- 優先給「具體物件、誰建立、誰持有、誰呼叫誰、資料何時建立」的因果模型，再給抽象名詞。
- 一個必要名詞第一次出現時必須當場定義；不得先在圖、code、demo output 或結論中使用，幾節後才補解釋。
- Runtime debug output 也是 learner-facing content；不能因為它是原生 API 欄位就跳過 prerequisite definition。
- 配置值與 runtime state 若是不同概念，UI label 必須明確分開，不能靠相似名稱暗示它們等價。
- 圖像必須忠實表達關係；箭頭應說明是 creates / calls / contains / flows to 等哪種關係。
- 手機是主要閱讀場景之一，hierarchy、table、code block 與 callout 都要避免橫向 overflow。
- 不使用「JS 抓 event」等方便但模糊的擬人化描述。

## Return to main path

等這條 prerequisite branch 通過 retrieval 後，再回到：

`browser click → native Event / listener callback → Faro ClickInstrumentation 接手 → 讀取 target/context → 建立 Faro telemetry`
