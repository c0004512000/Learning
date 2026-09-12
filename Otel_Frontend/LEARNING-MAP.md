# Frontend OTel / Faro Course Map

## Mission

接手並維運既有 Faro 前後端可觀測性方案：能從瀏覽器事件開始，追到 Faro telemetry、Alloy／OTel Collector、Tempo／Loki／OpenSearch，並能用程式碼、Browser DevTools 與 runtime evidence 判斷資料如何流動、哪裡失敗，以及如何安全修改、導入與優化。

## Planning basis

本課程依 `Learning-from-docs` 的 source model 規劃：8 份 `sources/materials/` 原始 HTML 已完成 corpus audit，並由 `sources/evidence/` 保存可重用的 verified findings；主路徑依概念依賴與 Mission 排序，而不是照檔名順序授課。未來 Lesson 的位置先規劃，但完整 Lesson HTML 仍只在實際學到該步時逐步產生。

Learner interaction 顯示 Browser runtime / DOM / Web API 是理解 Lesson 1 的實質 prerequisite，因此新增一個短的 Lesson 0。這不是把 Mission 擴張成完整 Frontend 課程；Lesson 0 只處理 Faro 主線必需的 host/runtime responsibility boundary。

## Progress

- **目前位置：Milestone 2 / Lesson 3**
- **主線狀態：Lesson 3 已產生，從單次 click handling 往上追 package initialization、Faro instance singleton 與 public API lifecycle**
- **Prerequisite debt：Lesson 0 / Lesson 1 的 Browser runtime 與 Event mental model 已重構，但仍需要 retrieval evidence 才能視為 mastered**
- **Lesson 2 mastery：教材已建立，但仍不能只因教材已讀或已產生就視為 mastered；需要 retrieval / practice evidence**
- **完成判準：不能只因教材已讀或教材已修正就算完成；需要 retrieval / practice evidence**

## Complete main course path

### Milestone 0 — Required Browser runtime foundation

#### Lesson 0 — Browser Runtime Foundation
**Objective:** 建立 Faro 所需的最小 Browser host mental model：分清楚 source files、Browser runtime、JavaScript core language、Web APIs、live DOM 與 network capability；能解釋為什麼 JavaScript 需要透過 Browser 提供的 API 操作目前頁面。

**Durable lesson:**
- `lessons/0000-browser-runtime-foundation.html`

**Primary / prerequisite sources:**
- Mission-relevant source documents對 Browser runtime 細節沒有完整教學，因此使用 MDN JavaScript technologies overview / language overview、WHATWG HTML Document、MDN `Document.querySelector()` 補 prerequisite。

**Dependency:** Lesson 1 的必要前置；不是獨立 Frontend curriculum。

**Scope boundary:**
- 只建立 `source → Browser host → runtime DOM / Web APIs → JavaScript reference`。
- `fetch()` 只教 responsibility boundary；CORS / preflight 延後到 Lesson 5 Browser-to-Alloy transport。

### Milestone 1 — Browser event → Faro instrumentation boundary

#### Lesson 1 — How a Browser Click Reaches JavaScript
**Objective:** 在 Lesson 0 的 Browser runtime 前提上，聚焦 listener registration、target determination、Event object、event path、dispatch、Capture / Target / Bubble、`target` / `currentTarget` 與 callback invocation；能解釋一次 click 為什麼最後會進入 JavaScript callback。

**Durable lesson:**
- `lessons/0001-browser-click-foundation.html`

**Primary source:**
- `3. Faro-Click-Tracking Introduction (for developer).html`

**Supplementary prerequisite references:**
- WHATWG DOM / EventTarget
- `reference/0001-dom-document-event-dispatch.html`
- `reference/0002-callback-function.html`
- `reference/0003-browser-runtime-web-apis.html`

**Dependency:** Lesson 0；整個 Faro click tracking 主線的必要前置。

**Established model:**
- `addEventListener()` 先建立 listener registration。
- user input 發生後，Browser 先判定 target，再建立 Event object。
- Event object 是獨立 object；`event.target` reference 到 target DOM object，不是 Event 暫時掛到 target 上。
- dispatch 不是尋找 target；dispatch 依 event path / phase / listener registrations 決定 callback invocation。
- target 已知仍需要 dispatch，因為 listeners 可以位於 target ancestors。
- `event.target` 保留最初 target；`currentTarget` / `eventPhase` 反映 dispatch 當下狀態。
- Event 若沒有被 JavaScript 持續引用，之後可由 GC 回收；這不是把 Event 從 target 上移除。

#### Lesson 2 — How ClickInstrumentation Handles Browser Clicks
**Objective:** 從原生 click listener 往下追，理解 ClickInstrumentation 的註冊、事件篩選、欄位擷取與 telemetry 建立責任邊界。

**Durable lesson:**
- `lessons/0002-faro-click-instrumentation.html`

**Primary sources:**
- `3. Faro-Click-Tracking Introduction (for developer).html`
- `4. Faro-Click-Tracking 的歷史.html`

**Durable evidence:**
- `sources/evidence/faro-click-tracking.md`

**Dependency:** Lessons 0–1。

**Established model:**
- `document` 上的 non-capture click listener 如何接到 Browser Event。
- `trackAttributes` 是 payload extraction schema，不是 listener 清單。
- 每個 `data-*` 從 `event.target` 透過 `closest()` 獨立往 ancestor 查找。
- 空 payload、同 target 300ms throttle 與 `api.pushEvent('click', payload)` 的責任邊界。
- Browser Event 與 Faro telemetry event 必須分成兩個不同物件／生命週期理解。

### Milestone 2 — 讀懂並安全修改 `@sre2/faro-click-tracking`

#### Lesson 3 — Package Initialization, Singleton, and Public API
**Objective:** 能從宿主應用呼叫點追進套件初始化流程，分清楚宿主應用、package 與 Faro SDK responsibility，並理解 module-level Faro instance 與 public API lifecycle。

**Durable lesson:**
- `lessons/0003-package-initialization-singleton-public-api.html`

**Primary sources:**
- `3. Faro-Click-Tracking Introduction (for developer).html`
- `4. Faro-Click-Tracking 的歷史.html`
- 現行 `faro-click-tracking` README / package contract / implementation evidence（見 `sources/evidence/faro-click-tracking.md`）

**Dependency:** Lesson 2。

**Current focus:**
- `initFaro(config)` 是公司共用套件 public API；Grafana `initializeFaro({...})` 是底層 SDK 初始化 function，兩者不可混為一談。
- `initFaro()` 負責 validation / orchestration，建立 Click / Tracing / optional UserSync instrumentations，再交給 Faro SDK 建立 runtime。
- `ClickInstrumentation` 是在 package initialization 時交給 Faro SDK，因此 Lesson 2 的 `document` listener 在這個 lifecycle 中被啟動。
- package 以 module-scope `faroInstance` 保存唯一 Faro instance，讓非-instrumentation public API 也能存取 Faro API。
- `ensureNotInitialized()` 必須在 `initializeFaro()` 前 fail fast；`registerFaroInstance()` 再做最後一道重複註冊防線。
- 第二次 `initFaro()` 會在建立新 SDK runtime 前失敗；重複 listeners／telemetry 是缺少防護時的風險推演，不是已證實的完整歷史 rationale。
- instrumentations 內部存在 `destroy()`，但 package public exports 沒有完整 `dispose()`／reset API。

#### Lesson 4 — User, Device, and Environment Context
**Objective:** 理解 user callback、device 判定、environment context 的來源、生命週期與寫入位置，能判斷應由宿主應用還是共用套件提供資料。

**Primary sources:**
- `1. PI 前端監控案例.html`
- `3. Faro-Click-Tracking Introduction (for developer).html`
- `4. Faro-Click-Tracking 的歷史.html`

**Durable evidence:**
- `sources/evidence/faro-click-tracking.md`
- `sources/evidence/foreman-integration.md`
- `sources/evidence/jeter-integration-and-tracing.md`

**Dependency:** Lesson 3。

### Milestone 3 — Host integration 與 Browser DevTools 驗證

#### Lesson 5 — Faro SDK Initialization and Browser-to-Alloy Transport
**Objective:** 理解 Faro SDK 初始化、receiver endpoint、payload/meta 與 CORS 的因果關係，能從 browser network request 判斷資料有沒有真正送出。

**Primary sources:**
- `1. PI 前端監控案例.html`
- `2. Grafana Faro & Alloy - 前端可觀測性.html`
- `SRE - 前端監控 - Proposal.html`

**Runtime / authoritative evidence:**
- deployed JavaScript bundles
- stage / production `/alloy` CORS preflight
- Grafana Alloy Faro receiver documentation
- `sources/evidence/browser-to-alloy.md`

**Dependency:** Lessons 2–4；Lesson 0 只提供 Browser networking / security responsibility bridge。

#### Lesson 6 — Browser-Side Verification with DevTools
**Objective:** 能用 Elements / Console / Network 驗證 click target、callback/context、Faro payload、request headers、response 與 CORS，而不是只看畫面有沒有反應。

**Primary sources:**
- `1. PI 前端監控案例.html`
- `2. Grafana Faro & Alloy - 前端可觀測性.html`
- `3. Faro-Click-Tracking Introduction (for developer).html`

**Dependency:** Lesson 5。

### Milestone 4 — Frontend ↔ Backend distributed trace

#### Lesson 7 — Frontend-to-Backend Trace Context Propagation
**Objective:** 從 trace ID / span relationship 出發理解 propagation，能解釋 `traceparent` 是在哪裡產生、如何跨 HTTP request 傳遞，以及 backend 如何延續同一條 trace。

**Primary source:**
- `6. 前後端 Trace 串接範例.html`

**Supporting source:**
- `2. Grafana Faro & Alloy - 前端可觀測性.html`
- Faro Web SDK tracing implementation / configuration evidence

**Dependency:** Lessons 5–6。

#### Lesson 8 — Verifying a Single Trace from Browser to Tempo
**Objective:** 能用 browser headers、backend instrumentation 與 Tempo trace evidence 驗證前後端是否真的共享 trace ID，並定位 propagation 中斷點。

**Primary source:**
- `6. 前後端 Trace 串接範例.html`

**Runtime evidence:**
- Jeter frontend / ASP.NET Core backend / OTLP configuration
- Grafana Tempo datasource
- `sources/evidence/jeter-integration-and-tracing.md`
- `sources/evidence/grafana-current-state.md`

**Dependency:** Lesson 7。

### Milestone 5 — Alloy / OTel Collector / storage pipeline

#### Lesson 9 — Faro Receiver to Alloy and OTel Collector
**Objective:** 能畫出 telemetry 進 Alloy 後如何被轉成 OTel signals，再進 Collector receiver / processor / exporter；知道每一層能改什麼、不能改什麼。

**Primary sources:**
- `2. Grafana Faro & Alloy - 前端可觀測性.html`
- `5. Deploy Alloy Server - Production.html`
- `7. OTel export to OpenSearch.html`

**Runtime evidence:**
- stage / production Alloy and Collector runtime configuration
- `sources/evidence/browser-to-alloy.md`
- `sources/evidence/collector-pipeline.md`

**Dependency:** Lessons 5、7。

#### Lesson 10 — Faro Logs to OpenSearch: Transformation, Mapping, and Indexing
**Objective:** 理解 Faro payload → OTel log → transform/filter → OpenSearch document/index 的資料形狀變化，能追欄位為何出現、消失或改名。

**Primary source:**
- `7. OTel export to OpenSearch.html`

**Supporting evidence:**
- OTel Faro translator
- filter / transform processor version-specific behavior
- `Application for DE service` / `OpenSearch Connection`
- `sources/evidence/opensearch-field-lifecycle.md`

**Dependency:** Lesson 9。

### Milestone 6 — Production deployment & troubleshooting

#### Lesson 11 — Production Alloy and Collector Deployment
**Objective:** 能讀 production 部署設定，辨識 stage/prod endpoint、Collector version、namespace、credential boundary 與 rollout 風險。

**Primary sources:**
- `5. Deploy Alloy Server - Production.html`
- `7. OTel export to OpenSearch.html`
- `SRE - 前端監控 - Proposal.html`

**Runtime evidence:**
- stage/prod Helm、ConfigMap、Kubernetes runtime
- `升級 Otel Stack`
- `sources/evidence/collector-pipeline.md`
- `sources/evidence/opensearch-field-lifecycle.md`

**Dependency:** Lessons 9–10。

#### Lesson 12 — Production Troubleshooting: From Symptoms to Fault Domain
**Objective:** 面對「沒有 click telemetry」「有 request 但 backend 沒資料」「trace 斷掉」「OpenSearch 查不到」「環境寫錯 cluster」等症狀，能沿 browser → Faro → Alloy → Collector → Tempo/Loki/OpenSearch 逐層用證據縮小問題。

**Primary sources:**
- 8 份 primary HTML 中與實際導入、部署、trace、OpenSearch 相關內容

**Runtime evidence:**
- Grafana dashboard / datasource
- OpenSearch index
- Kubernetes runtime
- deployed bundles / repository implementation

**Dependency:** Lessons 0–11；這是 Mission 的整合能力檢查。

## Current adaptive prerequisite branches

### Browser runtime / JavaScript host environment

Lesson 1 實際暴露後，已升格成短 prerequisite Lesson 0，而不是繼續把所有問題塞進 Lesson 1。

- Lesson: `lessons/0000-browser-runtime-foundation.html`
- Reference: `reference/0003-browser-runtime-web-apis.html`
- 要解決的問題：source vs runtime、Browser host environment、JavaScript core vs Web APIs、DOM ownership、`document.querySelector()`、live DOM mutation、network capability responsibility。
- Scope boundary：不展開完整 Browser internals；CORS 留在 Lesson 5。
- 狀態：artifact 已建立；尚未以 retrieval 證明 mastered。

### DOM / `document` / Event dispatch

這是 Lesson 1 的 event-specific prerequisite / reference branch。

- Reference: `reference/0001-dom-document-event-dispatch.html`
- 要解決的問題：EventTarget、target/path、capture/target/bubble、listener invocation、event delegation / propagation controls。
- 狀態：Lesson 1 已重新聚焦 event lifecycle，reference 保留作較完整查表；尚未以 retrieval 證明 mastered。Lesson 2 直接重用這套模型理解 `document.addEventListener('click', ...)`。

### Callback

這也是 Lesson 1 實際暴露的 blocker。

- Reference: `reference/0002-callback-function.html`
- 要解決的問題：`handleClick` vs `handleClick()`、function value、callback control direction。
- 狀態：reference 已建立；尚未以 retrieval 證明 mastered。Lesson 2 直接套用到 `this.handleClick` 被 Browser call back 的控制方向。

## Resume point

目前主線位於 **Lesson 3 — Package Initialization, Singleton, and Public API**：

`宿主應用 → initFaro(config) → ensureNotInitialized() → package instrumentations → Grafana initializeFaro(...) → Faro runtime → registerFaroInstance(faro) → package public APIs`

Lesson 0 / Lesson 1 / Lesson 2 的 prerequisite 與 retrieval debt 仍保留，不因開始 Lesson 3 就自動標記 mastered。

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

外部官方文件、repo/code、Confluence 與 runtime evidence 只在 prerequisite、verification、ambiguity resolution 或理解 primary corpus 必要時補充；不取代 primary corpus。可重用的核查結果集中於 `sources/evidence/`，引用指標集中於 `sources/linked/`。
