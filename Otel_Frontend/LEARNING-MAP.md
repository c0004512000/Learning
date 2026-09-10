# Frontend OTel / Faro Learning Map

## Ultimate Goal

接手並維運既有 Faro 前端可觀測性方案：能從瀏覽器原生事件開始，追到 Faro telemetry、Alloy／OTel Collector、Tempo／Loki／OpenSearch，並能用程式碼、DevTools 與 backend 證據定位問題、協助導入、修改與優化。

## Capability Milestones

這裡只保留能力里程碑，不預先生成完整 syllabus。細節會依實際學習路徑與文件中的阻塞點再展開。

1. 看懂 browser 原生事件與 Faro instrumentation 的責任邊界。
2. 讀懂並安全修改 `@sre2/faro-click-tracking`。
3. 能在宿主前端專案導入並用 DevTools 驗證資料。
4. 能把 frontend span 與 backend span 串成同一條 trace。
5. 能沿 Alloy／OTel Collector／backend pipeline 做 production troubleshooting。

## Current Position

**Milestone 1：browser 原生事件 → Faro instrumentation**

目前主教材：`lessons/0001-browser-click-foundation.html`

狀態：Lesson 1 已開始，但在讀取 Faro click tracking 文件時暴露出必要 browser prerequisite，已暫時走入支線補齊。

## Traversed prerequisite branches

### Branch A — DOM / `document` / Event dispatch

Why it appeared:
- 單純把 DOM 定義為「可操作頁面結構」過度抽象。
- 需要理解 `document.addEventListener(...)` 裡的 `document`、EventTarget、event path，以及 browser 如何把 click 交給 JavaScript。

Durable reference:
- `reference/0001-dom-document-event-dispatch.html`

Current state:
- 已建立具體 object / ownership / dispatch 模型。
- 尚未以 retrieval 證明完全 mastered。

### Branch B — Callback

Why it appeared:
- 理解 event listener 需要先知道函式為什麼能「先交出去、之後被叫回來」。
- 需要區分 `handleClick` 與 `handleClick()`，以及 callback 與 event / listener registration 的角色。

Durable reference:
- `reference/0002-callback-function.html`

Current state:
- 已建立控制方向與 call-back 命名模型。
- 尚未以 retrieval 證明完全 mastered。

## Now

回到主線前，只需要能說清楚這條因果鏈：

`使用者 click → browser 建立 Event → browser 分派 event → listener registration 命中 → browser 呼叫 callback(event) → JavaScript 讀取 event.target`

接著回到 Faro：

`native browser event → Faro ClickInstrumentation 接手 → 建立 Faro telemetry`

## Later

只有在主線真正走到時才展開：

- Faro click payload 與 transport
- user / device / environment context
- host integration 與 DevTools 驗證
- trace propagation / `traceparent`
- Alloy / Collector pipeline
- Tempo / Loki / OpenSearch troubleshooting

## Outside

目前不擴張：

- 與 Faro 接手無關的完整前端框架課程
- 深入瀏覽器 engine 實作細節
- 與 Mission 無關的 DE / Kafka / Dremio / Cassandra 主題

## Learning record

- `learning-records/0001-browser-dom-event-prerequisites.md`
