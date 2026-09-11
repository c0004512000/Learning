# Frontend OTel / Faro Course Map

## Mission

接手並維運既有 Faro 前後端可觀測性方案：能從瀏覽器原生事件開始，追到 Faro telemetry、Alloy／OTel Collector、Tempo／Loki／OpenSearch，並能用程式碼、Browser DevTools 與 runtime evidence 判斷資料如何流動、哪裡失敗，以及如何安全修改、導入與優化。

## Planning basis

本課程依 `Learning-from-docs` 的 bounded-corpus 規則規劃：8 份 `source-documents/` 原始 HTML 已完成 corpus audit，主路徑依概念依賴與 Mission 排序，而不是照檔名順序授課。未來 Lesson 的位置先規劃，但完整 Lesson HTML 仍只在實際學到該步時逐步產生。

## Progress

- **目前位置：Milestone 1 / Lesson 2**
- **主線狀態：已開始 Lesson 2，從 browser native click 接到 Faro `ClickInstrumentation`**
- **Lesson 1 prerequisite 狀態：DOM / Event dispatch 與 Callback reference 已建立，但尚未以 retrieval 證明 mastered**
- **完成判準：不能只因教材已讀就算完成；需要 retrieval / practice evidence**

## Complete main course path

### Milestone 1 — Browser event → Faro instrumentation boundary

#### Lesson 1 — 瀏覽器如何知道你點了哪裡
**Objective:** 建立 HTML、DOM、Event、EventTarget、listener、callback 與 `event.target` 的最小正確模型，能解釋一次 click 如何進入 JavaScript。

**Primary source:**
- `3. Faro-Click-Tracking Introduction (for developer).html`

**Supplementary prerequisite references:**
- WHATWG DOM / HTML
- MDN `addEventListener()` / callback

**Dependency:** 整個 Faro click tracking 主線的必要前置。

#### Lesson 2 — Faro ClickInstrumentation 如何接手 browser click
**Objective:** 從原生 click listener 往下追，理解 ClickInstrumentation 的註冊、事件篩選、欄位擷取與 telemetry 建立責任邊界。

**Durable lesson:**
- `lessons/0002-faro-click-instrumentation.html`

**Primary sources:**
- `3. Faro-Click-Tracking Introduction (for developer).html`
- `4. Faro-Click-Tracking 的歷史.html`

**Dependency:** Lesson 1。

**Current focus:**
- `document` 上的 non-capture click listener 如何接到 browser Event。
- `trackAttributes` 是 payload extraction schema，不是 listener 清單。
- 每個 `data-*` 從 `event.target` 透過 `closest()` 獨立往 ancestor 查找。
- 空 payload、同 target 300ms throttle 與 `api.pushEvent('click', payload)` 的責任邊界。
- Browser Event 與 Faro telemetry event 必須分成兩個不同物件／生命週期理解。

### Milestone 2 — 讀懂並安全修改 `@sre2/faro-click-tracking`

#### Lesson 3 — 套件初始化、singleton 與公開 API
**Objective:** 能從 host application 呼叫點追進套件初始化流程，分清楚 application responsibility、package responsibility 與 Faro SDK responsibility。

**Primary sources:**
- `3. Faro-Click-Tracking Introduction (for developer).html`
- `4. Faro-Click-Tracking 的歷史.html`
- 現行 `faro-click-tracking` README / package contract / implementation evidence（見 `CORPUS-AUDIT.md`）

**Dependency:** Lesson 2。

#### Lesson 4 — User / Device / Environment context 如何進 telemetry
**Objective:** 理解 user callback、device 判定、environment context 的來源、生命週期與寫入位置，能判斷應由 host application 還是共用套件提供資料。

**Primary sources:**
- `1. PI 前端監控案例.html`
- `3. Faro-Click-Tracking Introduction (for developer).html`
- `4. Faro-Click-Tracking 的歷史.html`

**Dependency:** Lesson 3。

### Milestone 3 — Host integration 與 Browser DevTools 驗證

#### Lesson 5 — Faro SDK 初始化與 browser → Alloy 傳輸
**Objective:** 理解 Faro SDK 初始化、receiver endpoint、payload/meta 與 CORS 的因果關係，能從 browser network request 判斷資料有沒有真正送出。

**Primary sources:**
- `1. PI 前端監控案例.html`
- `2. Grafana Faro & Alloy - 前端可觀測性.html`
- `SRE - 前端監控 - Proposal.html`

**Runtime / authoritative evidence:**
- deployed JavaScript bundles
- stage / production `/alloy` CORS preflight
- Grafana Alloy Faro receiver documentation

**Dependency:** Lessons 2–4。

#### Lesson 6 — 用 DevTools 做端到端 browser-side verification
**Objective:** 能用 Elements / Console / Network 驗證 click target、callback/context、Faro payload、request headers、response 與 CORS，而不是只看畫面有沒有反應。

**Primary sources:**
- `1. PI 前端監控案例.html`
- `2. Grafana Faro & Alloy - 前端可觀測性.html`
- `3. Faro-Click-Tracking Introduction (for developer).html`

**Dependency:** Lesson 5。

### Milestone 4 — Frontend ↔ Backend distributed trace

#### Lesson 7 — `traceparent` 如何把 frontend span 接到 backend span
**Objective:** 從 trace ID / span relationship 出發理解 propagation，能解釋 `traceparent` 是在哪裡產生、如何跨 HTTP request 傳遞，以及 backend 如何延續同一條 trace。

**Primary source:**
- `6. 前後端 Trace 串接範例.html`

**Supporting source:**
- `2. Grafana Faro & Alloy - 前端可觀測性.html`
- Faro Web SDK tracing implementation / configuration evidence

**Dependency:** Lessons 5–6。

#### Lesson 8 — 驗證同一條 trace：Browser → Backend → Tempo
**Objective:** 能用 browser headers、backend instrumentation 與 Tempo trace evidence 驗證前後端是否真的共享 trace ID，並定位 propagation 中斷點。

**Primary source:**
- `6. 前後端 Trace 串接範例.html`

**Runtime evidence:**
- Jeter frontend / ASP.NET Core backend / OTLP configuration
- Grafana Tempo datasource

**Dependency:** Lesson 7。

### Milestone 5 — Alloy / OTel Collector / storage pipeline

#### Lesson 9 — Faro receiver → Alloy → OTel Collector pipeline
**Objective:** 能畫出 telemetry 進 Alloy 後如何被轉成 OTel signals，再進 Collector receiver / processor / exporter；知道每一層能改什麼、不能改什麼。

**Primary sources:**
- `2. Grafana Faro & Alloy - 前端可觀測性.html`
- `5. Deploy Alloy Server - Production.html`
- `7. OTel export to OpenSearch.html`

**Runtime evidence:**
- stage / production Alloy and Collector runtime configuration

**Dependency:** Lessons 5、7。

#### Lesson 10 — Faro logs 到 OpenSearch：轉換、mapping、index
**Objective:** 理解 Faro payload → OTel log → transform/filter → OpenSearch document/index 的資料形狀變化，能追欄位為何出現、消失或改名。

**Primary source:**
- `7. OTel export to OpenSearch.html`

**Supporting evidence:**
- OTel Faro translator
- filter / transform processor version-specific behavior
- `Application for DE service` / `OpenSearch Connection`

**Dependency:** Lesson 9。

### Milestone 6 — Production deployment & troubleshooting

#### Lesson 11 — Production Alloy / Collector deployment 與環境差異
**Objective:** 能讀 production 部署設定，辨識 stage/prod endpoint、Collector version、namespace、credential boundary 與 rollout 風險。

**Primary sources:**
- `5. Deploy Alloy Server - Production.html`
- `7. OTel export to OpenSearch.html`
- `SRE - 前端監控 - Proposal.html`

**Runtime evidence:**
- stage/prod Helm、ConfigMap、Kubernetes runtime
- `升級 Otel Stack`

**Dependency:** Lessons 9–10。

#### Lesson 12 — Production troubleshooting：從症狀反推故障層
**Objective:** 面對「沒有 click telemetry」「有 request 但 backend 沒資料」「trace 斷掉」「OpenSearch 查不到」「環境寫錯 cluster」等症狀，能沿 browser → Faro → Alloy → Collector → Tempo/Loki/OpenSearch 逐層用證據縮小問題。

**Primary sources:**
- 8 份 primary HTML 中與實際導入、部署、trace、OpenSearch 相關內容

**Runtime evidence:**
- Grafana dashboard / datasource
- OpenSearch index
- Kubernetes runtime
- deployed bundles / repository implementation

**Dependency:** Lessons 1–11；這是 Mission 的整合能力檢查。

## Current adaptive prerequisite branches

### DOM / `document` / Event dispatch

這是 Lesson 1 實際暴露的 blocker，不是額外主線 Lesson。

- Reference: `reference/0001-dom-document-event-dispatch.html`
- 要解決的問題：DOM ownership、`document`、EventTarget、target/path、capture/target/bubble、listener invocation。
- 狀態：reference 已建立；尚未以 retrieval 證明 mastered。Lesson 2 會直接重用這套模型理解 `document.addEventListener('click', ...)`。

### Callback

這也是 Lesson 1 實際暴露的 blocker。

- Reference: `reference/0002-callback-function.html`
- 要解決的問題：`handleClick` vs `handleClick()`、function value、callback control direction。
- 狀態：reference 已建立；尚未以 retrieval 證明 mastered。Lesson 2 直接套用到 `this.handleClick` 被 browser call back 的控制方向。

## Resume point

目前已回到 **Lesson 2** 主線：

`browser native click → document listener → ClickInstrumentation.handleClick(event) → trackAttributes / closest() → payload filtering / throttle → Faro api.pushEvent()`

Lesson 1 的 prerequisite reference 仍保留為可回看的支線，不因開始 Lesson 2 就自動標記 mastered。

## Source boundary

Primary corpus:
1. `1. PI 前端監控案例.html`
2. `2. Grafana Faro & Alloy - 前端可觀測性.html`
3. `3. Faro-Click-Tracking Introduction (for developer).html`
4. `4. Faro-Click-Tracking 的歷史.html`
5. `5. Deploy Alloy Server - Production.html`
6. `6. 前後端 Trace 串接範例.html`
7. `7. OTel export to OpenSearch.html`
8. `SRE - 前端監控 - Proposal.html`

外部官方文件、repo/code、Confluence 與 runtime evidence 只在 prerequisite、verification、ambiguity resolution 或理解 primary corpus 必要時補充；不取代 primary corpus。