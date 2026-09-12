# Learning Record 0004 — Browser runtime / host environment prerequisite

Date: 2026-09-12

## Mission connection

這次仍然不是另開完整 Frontend 課程。Learner 在 Faro Lesson 1 追問 DOM / Event 時，進一步暴露出一個更前置的 blocker：尚未穩定區分「前端 source files」「Browser host environment」「JavaScript core language」「Browser Web APIs」「live DOM runtime state」。

這個 blocker 直接影響 Faro Mission：如果 Browser 的責任邊界不清楚，後續 `document.addEventListener()`、`fetch()`、Browser DevTools、CORS、Faro transport 都容易被理解成 JavaScript 語言本身的能力，或把 HTML source 與目前頁面 runtime state 混為一談。

## Pedagogical decision

原本 Course Map 把 DOM / `document` / Event dispatch 視為 Lesson 1 的 adaptive reference branch。這次 interaction 證明其中的「Browser runtime foundation」不只是查表知識，而需要自己的 `understand → retrieval` 迴圈，因此升格為短 prerequisite Lesson 0。

新的責任切分：

- **Lesson 0 — Browser Runtime Foundation**
  - source files vs runtime state
  - Browser = Web Application host environment
  - JavaScript core language vs Browser Web APIs
  - HTML source → DOM runtime objects
  - `document.querySelector()` 查的是 current DOM
  - DOM mutation 不改寫 original HTML source
  - `fetch()` 是 host/runtime capability；CORS 細節延後
- **Lesson 1 — How a Browser Click Reaches JavaScript**
  - listener registration
  - hit testing / target determination
  - Event object creation
  - event path / dispatch
  - Capture / Target / Bubble
  - `target` vs `currentTarget`
  - Browser callback invocation
  - Event object lifetime / GC boundary
- **Lesson 2 onward** 保持 Faro 主線，不擴張成完整前端 curriculum。

## Mental-model shifts established in conversation

1. **「一起打包」不代表 JavaScript 天然持有 HTML element**
   - HTML、CSS、JavaScript 可以一起部署，但 Browser 仍分別解析／套用／執行。
   - JavaScript 操作的是 Browser 建立的 runtime objects，而不是直接操作 HTML source text。

2. **Browser 不等於 HTTP Server，也不等於 JavaScript engine**
   - Browser 是 host environment；JavaScript engine 只是其中負責執行 ECMAScript 的一部分。
   - DOM、Event、networking、rendering、storage、安全限制等都屬於更大的 Browser runtime。

3. **JavaScript language vs host APIs 必須分開**
   - `Object` / `Array` / `Promise` 等屬於 JavaScript core。
   - `document` / DOM APIs / `fetch()` 等由 Browser host environment 提供。
   - 同一個 JavaScript 語言跑在 Browser 與 Node.js 時，可以有不同 host capabilities / restrictions。

4. **DOM 是 live runtime model，不是 source copy 的同義詞**
   - HTML source 經 Browser parse 後形成 initial DOM；之後 JavaScript 可以 mutate live DOM。
   - DOM element 被 remove，不會修改 Server 原本回傳或 repository 裡的 HTML source。
   - Kubernetes 對照有效：manifest / YAML 是宣告；cluster runtime objects 是目前真實狀態。類比到 Browser 時，HTML source 更接近 declaration，DOM 更接近 runtime object model。

5. **`querySelector('#buy')` 是 runtime query**
   - 查的是目前 Document 裡第一個符合 selector 的 Element。
   - `#buy` 只表示 `id="buy"`，不限定 `<button>`；若要限定，使用 `button#buy`。

6. **Event dispatch 的責任重新收斂**
   - target 在 dispatch 前已經由 Browser 判定；dispatch 不是尋找 target。
   - dispatch 的核心是沿 event path，依 phase、event type、listener registrations 決定 callback invocation order。
   - 已知 target 仍不能只看 target 自己的 listener，因為 ancestors 也可能註冊 listeners。

7. **Event object 不會暫時掛在 target 上**
   - 正確方向是 `Event.target → target DOM object`。
   - `target` 大致固定；`currentTarget` / `eventPhase` 反映 dispatch 目前位置。
   - Event 是獨立 runtime object；如果 JavaScript 不再保存 reference，之後可由 GC 回收。

8. **CORS 應留在 Faro transport 主線**
   - 現階段只需知道 Browser networking 受到 Browser security model 控制。
   - 正式 CORS / preflight 應在 Lesson 5 Browser-to-Alloy transport 時處理，因為那時直接服務 Mission，而不是現在擴張成 Web security 課。

## Durable artifact changes required

- 新增 `lessons/0000-browser-runtime-foundation.html`。
- 新增 `reference/0003-browser-runtime-web-apis.html`。
- 重寫 `lessons/0001-browser-click-foundation.html`，移除 Browser runtime foundation 的重複負擔，聚焦 Event lifecycle。
- 更新 `LEARNING-MAP.md` 與 `learning-map/index.html`，把 Lesson 0 顯示為實際發生的 prerequisite branch / Milestone 0，而不是改寫整個 Faro Mission。
- `RESOURCES.md` 增補 JavaScript core vs host runtime、`querySelector()` 的 authoritative prerequisite references。

## Current ZPD

目前不能把 Browser runtime / Event prerequisite 標記 mastered。後續 retrieval 應確認 learner 能自行回答：

- Browser、JavaScript engine、JavaScript language 三者是什麼關係？
- 為什麼 HTML / CSS / JS 一起部署，JS 仍需要 DOM API？
- DOM 為什麼比較像 Kubernetes runtime objects，而不是 Git 裡的 manifest？這個類比在哪裡停止？
- `document.querySelector('#buy')` 查的是什麼？為什麼不限定 button？
- DOM remove button 後，原始 HTML source 為什麼還在？
- `fetch()` 為什麼是 host capability？Browser 與 Node.js 的同一段 JS 為什麼可能有不同限制？
- dispatch 開始以前 target 是否已知？
- 為什麼 target 已知後仍需要 event path / dispatch？
- Event object 與 target DOM object 的 reference direction 是什麼？
- `target`、`currentTarget`、`eventPhase` 哪些是穩定身份，哪些反映 dispatch 當下狀態？

## Return to Faro main path

這條 prerequisite 足夠後，不繼續延伸完整 Browser internals。回到：

`Browser Event → ClickInstrumentation → DOM context extraction → Faro telemetry → package lifecycle → Browser-to-Alloy transport`
