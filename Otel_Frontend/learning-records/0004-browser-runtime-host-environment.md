# Learning Record 0004 — Browser runtime / host environment prerequisite

Date: 2026-09-12

## Mission connection

這次仍然不是另開完整 Frontend 課程。Learner 在 Faro Lesson 1 追問 DOM / Event 時，進一步暴露出一個更前置的 blocker：尚未穩定區分「前端 source files」「Browser 執行環境」「JavaScript 語言本身」「Browser Web APIs」「live DOM runtime state」。

這個 blocker 直接影響 Faro Mission：如果 Browser 的責任邊界不清楚，後續 `document.addEventListener()`、`fetch()`、Browser DevTools、CORS、Faro transport 都容易被理解成 JavaScript 語言本身的能力，或把 HTML source 與目前頁面 runtime state 混為一談。

## Pedagogical decision

原本 Course Map 把 DOM / `document` / Event dispatch 視為 Lesson 1 的 adaptive reference branch。這次 interaction 證明其中的「Browser runtime foundation」不只是查表知識，而需要自己的 `understand → retrieval` 迴圈，因此升格為短 prerequisite Lesson 0。

新的責任切分：

- **Lesson 0 — Browser Runtime Foundation**
  - source files vs runtime state
  - Browser 作為 Web 應用的執行環境
  - JavaScript 語言本身 vs Browser Web APIs
  - HTML source → live DOM
  - DOM mutation ≠ 修改原始 HTML source
  - `fetch()` 只建立 responsibility boundary；CORS 留待 Lesson 5
- **Lesson 1 — How a Browser Click Reaches JavaScript**
  - listener registration
  - target determination
  - Event object
  - event path
  - Capture / Target / Bubble
  - listener invocation / callback
- **Lesson 2 — How ClickInstrumentation Handles Browser Clicks**
  - Faro 從 Browser Event 接手後的 telemetry extraction / filtering / throttle / pushEvent

## Durable teaching constraints confirmed

- source 與 runtime 必須在 DOM query 之前分清楚。
- Browser 應先以具體責任解釋，再視需要命名抽象概念；不能用未知術語解釋另一個未知術語。
- 目前 Faro prerequisite 不需要額外介紹 `ECMAScript`；若未來沒有 Mission 需要，不主動增加這個名詞負擔。
- Lesson 0 只處理 Browser/runtime responsibility boundary；Lesson 1 才處理 Event dispatch；CORS 留在 Browser-to-Alloy transport 的 later Lesson。
- Learner follow-up 是 diagnostic evidence，不等於 durable lesson prose。Event object garbage-collection / saved-reference 細節目前不服務 Faro Mission，不應因為一次追問就升格成 Lesson 1 正式章節。
- Lesson → Reference → Lesson navigation 必須在 learner-facing artifact 裡明顯可見，不能只靠 Learning Map 才找得到。
- 課程已有 shared `quiz.js` / `.quiz` component 時，retrieval check 應重用既有元件，不任意改成另一種 disclosure UI。
- Quiz 選項除了 render-time shuffle，也要避免明顯的長度／格式提示。

## Durable Reference

新增：

- `reference/0003-browser-runtime-web-apis.html`
  - source vs runtime
  - JavaScript language vs Browser-provided APIs
  - HTML source vs current DOM
  - `document.querySelector()`
  - Browser-side network responsibility boundary

Lesson 0 應直接連到這份 Reference，Reference 也應直接提供返回 Lesson 0 的路徑。

## ZPD update

目前 Browser prerequisite 已經從單純 DOM/Event blocker 細化成兩層：

1. Browser runtime / DOM / Browser APIs responsibility model。
2. Browser native Event lifecycle / dispatch model。

兩層都仍屬於 Faro Mission 的 prerequisite；不因教材已存在就視為 mastered。

後續 retrieval 應優先確認 learner 是否能自己重建：

- source 與 runtime 的差別；
- Browser、JavaScript、DOM 三者各自的責任；
- `document.querySelector()` 查的是什麼；
- DOM mutation 為什麼不等於修改原始 HTML；
- Browser-side `fetch()` 為什麼仍經 Browser；
- target 何時確定；
- dispatch 在 target 已知後還負責什麼；
- Event object 與 target DOM object 的 reference 方向；
- Browser 如何從 listener registration 走到 callback execution。

## Return to main path

這條 prerequisite branch 穩定後，回到：

`Browser Event → ClickInstrumentation → DOM context → Faro telemetry → transport → backend pipeline`
