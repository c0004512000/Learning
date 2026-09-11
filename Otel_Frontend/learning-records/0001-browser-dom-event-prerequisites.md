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

1. **DOM ownership 必須和 JavaScript access 分開**
   - DOM object 是瀏覽器建立與管理；JavaScript 透過 browser 提供的 DOM API 取得 object reference 並操作。
   - `HTMLButtonElement` 應解釋為按鈕 DOM object 對程式暴露的介面／型別，不應導向不存在的「HTML object」概念。

2. **範例 selector 必須在首次使用前定義**
   - HTML `id="..."` 是作者給 element 的識別名稱；selector `#xxx` 表示找 id 為 xxx 的 element。

3. **DOM hierarchy 必須被圖真正表達**
   - 多張縮排卡片曾讓 learner 誤判節點彼此平行。
   - 父子關係應優先使用單一 tree / 明確 connector。

4. **Event lifecycle 必須拆成不同責任步驟**
   - user input → browser receives → hit testing / target determination → Event creation → dispatch → listener invocation。
   - target 不是 Event creator。Event object 由 browser 建立；target 是 browser 對本次 event 判定的 DOM object。

5. **`event.target` 命名需要因果模型**
   - `event.target` 回答「這次 Event 最初指向哪個 DOM object」，不是「誰觸發／創造 Event」。

6. **Bubbling / Capture 不可在定義前直接使用**
   - 順序：先知道 target/path 已確定 → 定義 phase → Capture → Target → Bubble → 再介紹 `capture` option。
   - Capture 不是 browser 邊走邊尋找 target；target/path 先確定，dispatch 才沿 path 呼叫符合條件的 listeners。

7. **`capture: true/false` 的語法理解已建立，但需要 decision model**
   - Capture 與 Bubble 都能讓 ancestor 統一看到 descendant click；差別不是「能不能統一監聽」，而是 listener 在 target 前或 target 後收到。
   - `capture: false` 是預設，不應簡化成「Bubble 是預設」。listener 若本身就是 target，non-capture listener 仍是在 Target phase 執行。

8. **`event.eventPhase` 曾在 demo 中先於定義出現**
   - 必須先定義 phase = 同一次 dispatch 當下走到哪一段，再介紹 `eventPhase` 只是 runtime API 表示值。
   - UI 應優先顯示 `CAPTURE / TARGET / BUBBLE`，數字 1 / 2 / 3 只作 API 對照。

9. **listener registration option 與 runtime event phase 必須分開**
   - `capture: true` 是 listener 事先登記的設定；`event.eventPhase` 是本次 dispatch 當下的位置。
   - 如果 `capture: true` listener 所在物件恰好就是 target，它仍在 Target phase (`AT_TARGET`) 被呼叫。

10. **Bubble 曾被誤解成 target listener 會再執行一次**
   - Learner 看到 `button → main → body → document` 容易理解成 button listener 在 Target 後又會於 Bubble 重跑。
   - 正確模型：target listeners 在 Target phase 處理；之後的 Bubble 處理 target 的 ancestors。Bubble 不會讓 target 的同一個 listener自動再執行一次。
   - 如果 descendant 與 ancestor 各自都有 click listener，同一次 click 可能讓兩個不同 listeners 各自執行；這不是同一個 handler 被 browser 重複呼叫。

11. **`stopPropagation()` 需要以真正用途理解，不能當成 click 防重複工具**
   - `stopPropagation()` 只截斷這一次 Event 後續沿 event path 的傳遞；不是 server/network/browser failure，也不代表 JavaScript 停止執行。
   - 正常 click bubbling 不需要每個 handler 都呼叫 `stopPropagation()`。
   - 只有當 component 明確不希望更外層 ancestors 收到這次 Event 時，才考慮截斷；否則也可讓 Event 正常 bubble，由 ancestor 根據 `event.target` 自己決定是否處理。

12. **`event.bubbles` 與 propagation stop 是不同責任**
   - `event.bubbles` 是 read-only Event property，表示這個 Event 是否具備 target 後 ancestor bubbling 的能力。
   - `stopPropagation()` 不會把 `event.bubbles` 從 true 改成 false；它只停止目前這一次 dispatch 的後續 propagation。
   - Synthetic Event 可以在建立時指定 `bubbles`，但不要把「Event 的性質」和「某一次 dispatch 中途被截斷」混成同一個狀態。

13. **Tracing 細節目前應延後**
   - Learner 尚未建立 Span / parent-child / active context / context propagation 的必要前置模型。
   - 這些屬於 Faro / OTel Mission 內的 Later topic，不是理解 DOM Event 的當前 prerequisite。
   - 現階段只保留最小 bridge：Capture / Bubble 會改變 telemetry listener 看到 click 的時機；更深 tracing semantics 回到後續主線正式教。

14. **「JavaScript 抓 event」會形成錯誤控制流模型**
   - JavaScript 先登記 callback；browser 之後在 dispatch 過程中主動呼叫 callback，並把本次 Event object 傳入。

15. **`document` 必須有具體 referent**
   - `document` 是 JavaScript 取得目前 HTML document 所對應 `Document` object 的入口，不是泛稱文件。

16. **Callback 必須以控制方向理解**
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
- Target：Event 到達 target；target listener 不會因後續 Bubble 自動重跑一次。
- Bubble：對允許 bubbling 的 Event，Target 後從 target 的 parent 開始往外處理 ancestor non-capture listeners。
- Capture 與 Bubble 都能支援 ancestor 統一監聽 descendant event；差別主要是 listener timing。
- `capture` registration option ≠ `event.eventPhase` runtime state。
- `event.target` 與 `event.currentTarget` 的責任差異。
- `event.bubbles` 表示 Event 是否具備 bubbling 能力；它和 `stopPropagation()` 是不同概念。
- `stopPropagation()` 是這一次 dispatch 的 propagation control，不是 handler deduplication。
- event delegation 利用 bubbling 讓 ancestor 統一處理 descendants。
- JS 不 polling click；browser dispatch Event 時呼叫 callback。
- Browser Event object 不等於 Faro telemetry record。
- Trace internals 暫不作為這條 prerequisite branch 的要求。

## Durable references

- `reference/0001-dom-document-event-dispatch.html`
  - browser ownership vs JS access
  - selector / DOM tree / EventTarget
  - target determination / Event creation / dispatch
  - phase definition before `event.eventPhase`
  - Capture vs Bubble decision model
  - Target listener 不因 Bubble 再執行一次
  - event delegation
  - `stopPropagation()` 的用途與限制
  - `event.bubbles` vs propagation stop
  - tracing 僅保留最小 bridge，進階 context semantics 延後
  - mobile demo 顯示 semantic phase names

- `reference/0002-callback-function.html`
  - callback 的角色
  - `handleClick` vs `handleClick()`
  - call back 命名邏輯
  - callback vs event vs listener registration
  - callback 不等於 async
  - Python 對照

## Current ZPD

目前應視為：**browser DOM / Event prerequisite 仍在建立中，不能把 Capture / Bubble / propagation 視為 mastered。**

下一次 retrieval 優先確認 learner 是否能用自己的話回答：

- DOM 是誰建立、誰持有？JavaScript 為什麼可以操作它？
- click Event 是誰建立？target 是誰判定？
- Capture 開始時 target 是否已經知道？
- phase 是什麼？`event.eventPhase` 又只是什麼？
- `capture: true/false` 是 registration setting 還是 runtime phase？
- 為什麼直接點 target 時，它的 listener 不會因 Bubble 再跑第二次？
- descendant 與 ancestor 各有 listener 時，為什麼同一次 click 可能觸發兩個不同 handlers？
- Capture 和 Bubble 都能做 ancestor-level monitoring，真正差異在哪？
- `event.bubbles` 與 `stopPropagation()` 各自控制什麼？
- 為什麼不應把 `stopPropagation()` 當成所有 click handler 的常態寫法？
- callback 是誰呼叫？Event object 怎麼進到 callback 參數？

若這些能穩定重建，再回到 Faro 主線。

## Teaching preference learned

遇到新的 frontend/browser 基礎概念時：

- 優先給「具體物件、誰建立、誰持有、誰呼叫誰、資料何時建立」的因果模型，再給抽象名詞。
- 一個必要名詞第一次出現時必須當場定義；不得先在圖、code、demo output 或結論中使用，幾節後才補解釋。
- Runtime debug output 也是 learner-facing content；不能因為它是原生 API 欄位就跳過 prerequisite definition。
- 配置值與 runtime state 若是不同概念，UI label 必須明確分開，不能靠相似名稱暗示它們等價。
- Event path 圖若把 target 與 Bubble ancestors 接在同一條箭頭上，必須明確標示 target 只在 Target phase 處理一次，避免形成「target handler 會再跑」的錯誤模型。
- 圖像必須忠實表達關係；箭頭應說明是 creates / calls / contains / flows to 等哪種關係。
- 手機是主要閱讀場景之一，hierarchy、table、code block 與 callout 都要避免橫向 overflow。
- 不使用「JS 抓 event」等方便但模糊的擬人化描述。

## Return to main path

等這條 prerequisite branch 通過 retrieval 後，再回到：

`browser click → native Event / listener callback → Faro ClickInstrumentation 接手 → 讀取 target/context → 建立 Faro telemetry`
