# Frontend OTel / Faro Course Map

## Mission

接手並維運既有 Faro 前後端可觀測性方案：能從瀏覽器事件開始，追到 Faro telemetry、Alloy／OTel Collector、Tempo／Loki／OpenSearch，並能用程式碼、Browser DevTools 與 runtime evidence 判斷資料如何流動、哪裡失敗，以及如何安全修改、導入與優化。

## Planning basis

原始 8 份 HTML 已完成 corpus audit；教學依概念依賴與 Mission 排序，不依檔名或對話先後排序。2026-10-22 追加的兩份主／支線對話補強既有 Lessons 5–8，不改變 Mission，不建立重複課程。來源保存在 materials／linked／evidence；Reference 是生成的可重用教學，不是原始證據。

- [HTML Learning Map](learning-map/index.html)：目前位置、全部里程碑、課程入口與 Reference 往返。
- [新增材料來源與範圍](sources/materials/2026-10-22-faro-conversation-materials.md)。
- [知識點逐項覆蓋與來源核查](sources/evidence/faro-conversation-verification-2026-10-22.md)。

## Progress

- **目前主線：Milestone 2／Lesson 3。** 沿 Lesson 2 已知的 click handler 往上追宿主如何呼叫 initFaro、建立並保存同一個 Faro object。
- **教材：Lesson 0–9 已建立；Lesson 10–12 已規劃，未建立完整 HTML。** 預先規劃不是預先授課；不得以補齊地圖為由一次生成所有未來課程。
- **Mastery：教材產出、修正、閱讀或歷史實務對話不等於 mastered。** Lesson 0／1 的 runtime與 Event 模型、Lesson 2 與後續課程仍須 retrieval／practice evidence。
- **本次更新不推進學習位置，也不清除先備概念欠缺的驗證。** Main path 與實務補充路線分開顯示。

## Complete main course path

### Milestone 0 — 必要的 Browser runtime 基礎

**Lesson 0 — Browser Runtime Foundation**  
[教材](lessons/0000-browser-runtime-foundation.html)。目標：先分清 source files、Browser host、JavaScript core、Web APIs、live DOM 與 network capability，再解釋 JavaScript 為何透過 Browser API 操作頁面。前置：無；為 Lesson 1 的必要橋接。只處理 Faro 所需的 host responsibility，不展開完整 Browser internals；fetch 的 CORS 留至 Lesson 5。

來源：原始材料缺少的 prerequisite，以 MDN JavaScript technologies／language overview、WHATWG Document、querySelector 官方規格補足；[Reference 0003](reference/0003-browser-runtime-web-apis.html)。

### Milestone 1 — Browser event → Faro instrumentation

**Lesson 1 — How a Browser Click Reaches JavaScript**  
[教材](lessons/0001-browser-click-foundation.html)。前置：Lesson 0。目標：listener registration → target determination → Event object → event path／phase → callback invocation。Event 是獨立 object；target 是最初命中位置，currentTarget 是當前 listener 位置，dispatch 不是尋找 target。GC 的回收也不是把 Event 從 element 上移除。

來源：原始材料 3、WHATWG DOM/EventTarget、[DOM／Event Reference](reference/0001-dom-document-event-dispatch.html)、[Callback Reference](reference/0002-callback-function.html)。

**Lesson 2 — How ClickInstrumentation Handles Browser Clicks**  
[教材](lessons/0002-faro-click-instrumentation.html)。前置：Lessons 0–1。目標：從 document 的非 capture listener 收到 click，沿 event.target 按各 trackAttributes 獨立 closest 查找、形成 payload，理解空資料／throttle／事件未到達的邊界。區分 Browser Event 與 Faro event；理解 application subsystem → DOM data-link-name → payload link_name 的語意橋接與選擇性 coverage。

來源：原始材料 3、4、[package evidence](sources/evidence/faro-click-tracking.md)、[Foreman source history](sources/evidence/data-link-name-investigation-2026-09-17.md)、[template inventory](sources/evidence/data-link-name-clickable-inventory-2026-09-17.md)。延伸：[Reference 0009](reference/0009-data-link-name-device-adoption.html)，不把 template declaration 數當成 runtime node 數。

### Milestone 2 — 讀懂內部 SDK 的初始化與 context

**Lesson 3 — How initFaro Starts Faro Click Tracking**  
[教材](lessons/0003-package-initialization-singleton-public-api.html)。前置：Lesson 2。目標：宿主 initFaro → ensureNotInitialized → 內部 Grafana initializeFaro → Faro object／instrumentation 初始化 → 保存 reference。Duplicate guard 在第二個 object／功能建立前拒絕重複初始化；singleton 只作可選術語，不是考點。User／Device 延至 Lesson 4，Tracing 延至後續課程。

來源：原始材料 3、4、[package evidence](sources/evidence/faro-click-tracking.md)、[Foreman integration](sources/evidence/foreman-integration.md)。

**Lesson 4 — User, Device, and Environment Context**  
[教材](lessons/0004-user-device-environment-context.html)。前置：Lesson 3。目標：判斷宿主與套件的資料 ownership、同步時機與寫入位置。先解釋 callback、visibilitychange／storage、maxTouchPoints／pointerdown，再使用正式名稱。User／device 為按需求啟用，不把歷史範例變成所有應用的要求。最後區分計數 signal、device context 與 KPI 分母；入口事件分布不是所有 users／sessions／操作的分布。

來源：原始材料 1、3、4、package／Foreman／[Jeter integration](sources/evidence/jeter-integration-and-tracing.md)。[Reference 0009](reference/0009-data-link-name-device-adoption.html)與 Lesson 2／4 皆有往返入口。

### Milestone 3 — Host integration 與 Browser DevTools 驗證

**Lesson 5 — Faro Browser-to-Alloy Transport**  
[教材](lessons/0005-faro-browser-to-alloy-transport.html)。前置：Lessons 2–4，Lesson 0 的 Browser networking responsibility。目標：分清 instrumentation、TransportItem、payload/meta、transport body、batch 與 HTTP request；receiver URL 不等於 backendUrls。理解同次操作可產生不同 signal／多筆 POST，queue、HTTP acceptance 與 storage queryability 是不同時間點。以 origin 與 request 條件說明 CORS／preflight；不展開 downstream pipeline。

來源：原始材料 1、2、Proposal、[browser-to-alloy](sources/evidence/browser-to-alloy.md)、[09/21 resource runtime](sources/evidence/faro-performance-resource-runtime-2026-09-21.md)、[10/05 IDP runtime](sources/evidence/idp-portal-keychain-runtime-2026-10-05.md)、[本次對話核查](sources/evidence/faro-conversation-verification-2026-10-22.md)。

補充：[Reference 0004 CORS](reference/0004-cors-preflight.html)、[Reference 0011 兩層 queue](reference/0011-faro-batching-and-queues.html)。後者處理 v2.12.1 固定 timer、單位、meta 分組與 flush 限制，讀完回 Lesson 5，不強制先背毫秒數才繼續主線。

**Lesson 6 — Browser-Side Verification with DevTools**  
[教材](lessons/0006-browser-devtools-verification.html)。前置：Lesson 5。目標：依要證明的事選擇 Elements／Console／Sources／Network，核對 click target、callback、context、payload、headers、response；先按 Method 與 payload 分類，不靠列數、順序或 status 猜資料身分。

來源：原始材料 1、2、3、[Foreman Browser lab](sources/evidence/foreman-browser-debug-lab.md)、[09/16 lab](sources/evidence/foreman-browser-lab-2026-09-16.md)、09/21 resource runtime、10/05 IDP runtime。補充：[Reference 0005](reference/0005-devtools-workspaces-for-faro.html)。既有真實截圖重用；沒有新 UI access 時不製作模擬截圖。

### Milestone 4 — Frontend ↔ Backend distributed trace

**Lesson 7 — Frontend-to-Backend Trace Context Propagation**  
[教材](lessons/0007-frontend-backend-trace-context-propagation.html)。前置：Lessons 5–6。目標：從 Browser／backend 不共享 runtime memory 推導 trace context 必須跨 HTTP 傳遞。Trace ID 是整條 trace，span ID 是各 operation；traceparent 的 parent-id 承載上游目前 spanId，下游建立新的 span。Business propagation 與 Faro telemetry export 分成兩條路；resource-performance event 與 tracing span 互補但不相同。

來源：原始材料 6、2、[propagation evidence](sources/evidence/trace-context-propagation.md)、[09/20 runtime join](sources/evidence/frontend-backend-trace-runtime-2026-09-20.md)、Jeter／IDP evidence、W3C、Faro v2.9.0 source。補充：[Reference 0006](reference/0006-w3c-traceparent.html)、[Reference 0008](reference/0008-faro-tracing-ownership-and-propagation.html)。保留 PR #37 的 app.name → Resource service.name 橋接，但不讓 Resource ownership 取代 propagation 主題。

**Lesson 8 — Verifying a Single Trace from Browser to Tempo**  
[教材](lessons/0008-verifying-single-trace-browser-to-tempo.html)。前置：Lesson 7。目標：固定一筆安全、可辨認的 request，將 Browser header T/A、Frontend span 與 Backend parent chain 對齊；有中介 span 時核對完整 chain。區分 UI 可見 SpanID、raw parentSpanId 與 API 編碼。以來源／runtime／scope／kind／parent 證明跨前後端，不以色彩或 CLIENT／SERVER 單獨分類。找不到結果時，分查 runtime、propagation、export/storage 與 query filters。

來源：原始材料 6、Jeter frontend/backend config、[09/20 join](sources/evidence/frontend-backend-trace-runtime-2026-09-20.md)、[既有 raw trace](sources/evidence/raw/jeter-tempo-trace-2026-09-20.json)、[10/05 IDP](sources/evidence/idp-portal-keychain-runtime-2026-10-05.md)、[app.name source chain](sources/evidence/faro-app-name-otel-service-name-2026-10-12.md)、本次對話核查。補充：[Reference 0010](reference/0010-trace-evidence-and-runtime-boundaries.html)，含 IDP 對話摘錄、CORS 片段與 backend CLIENT 反例；返回 Lesson 8 的 runtime 邊界。

### Milestone 5 — Alloy／OTel Collector／storage pipeline

**Lesson 9 — Faro Receiver to Alloy and OTel Collector**  
[教材](lessons/0009-faro-receiver-alloy-otel-collector.html)。前置：Lessons 5、7。目標：追不同 Faro signals 經 receiver／processor／exporter 到 storage；faro.performance.resource 經 OTLP log 進 Loki，tracing resourceSpans 走 Tempo。常用 resource 欄位聚焦 URL／status／duration／TTFB／response time／transfer size／cache／initiator；DNS／TCP／TLS 子時間只在 incident 需要時深入。接收不等於持久化。

來源：原始材料 2、5、7、[collector pipeline](sources/evidence/collector-pipeline.md)、browser-to-alloy、09/21 resource runtime、10/05 IDP runtime。新版 Lesson 5／8 不取代本課的 downstream 解說。

**Lesson 10 — Faro Logs to OpenSearch: Transformation, Mapping, and Indexing**  
已規劃、尚未建立完整教材。前置：Lesson 9。目標：追 Faro payload → OTel log → transform/filter → document/index，定位欄位出現、消失、改名與 indexing。

來源：原始材料 7、[OpenSearch field lifecycle](sources/evidence/opensearch-field-lifecycle.md)、Faro translator、版本化 filter／transform、內部 Application for DE service／OpenSearch Connection。

### Milestone 6 — Production deployment 與 troubleshooting

**Lesson 11 — Production Alloy and Collector Deployment**  
已規劃、尚未建立完整教材。前置：Lessons 9–10。目標：辨識 stage/prod endpoint、版本、namespace、credential boundary 與 rollout 風險。

來源：原始材料 5、7、Proposal、collector／OpenSearch evidence、內部升級 Otel Stack；實際部署改版時重新查證版本，不把歷史紀錄當成目前狀態。

**Lesson 12 — Production Troubleshooting: From Symptoms to Fault Domain**  
已規劃、尚未建立完整教材。前置：Lessons 0–11；作為整合能力驗收。目標：沿 Browser → Faro → Alloy → Collector → storage → query surface 找第一個不符合預期的邊界；涵蓋沒有 click、trace 斷鏈、寫錯 cluster、資料已存在卻被 Dashboard／selector／namespace 篩掉等情境。

來源：8 份原始 HTML 的實務部分、[Grafana evidence](sources/evidence/grafana-current-state.md)、部署／儲存 evidence、10/05 IDP query identity、此次 runtime／query 邊界核查。

## Adaptive branches 與回主線

- Browser runtime 已升格為短 Lesson 0；DOM／Event、Callback 的 References 供 Lessons 1–2 最小補課，不擴張為完整前端課程。
- PR #24 的語意／Device Adoption 以 Reference 0009 連接 Lessons 2／4；尚待產品定義 KPI 分母與實際聚合證據。
- PR #37 的 app.name／service.name 實作集中於 Reference 0008，Lessons 7／8 重用，不新增重複初始化 lifecycle。
- 本次 queue 支線集中於 Reference 0011，返回 Lesson 5；Trace evidence 支線集中於 Reference 0010，返回 Lesson 8。Sources 中的行政性匯出往返不轉為教材。
- [Reference 0007 Automatic telemetry／Web Vitals](reference/0007-faro-automatic-telemetry-and-web-vitals.html)保留查表用途，不因欄位存在就擴張目前導入範圍。

## Resume point

**Lesson 3：宿主 → initFaro → duplicate guard → initializeFaro → Faro object／ClickInstrumentation → 保存 reference。**

Lesson 0／1／2 的 retrieval debt 不因新教材、PR 合併或實務分支而消失。Mission 完成需所有 in-scope Lessons 與必要理解／練習被證明，而非所有來源都逐頁變成 Lesson。

## Source boundary

原始 8 份材料依序為 PI 前端監控案例、Grafana Faro & Alloy、Faro-Click-Tracking Introduction、Faro-Click-Tracking 的歷史、Deploy Alloy Server - Production、前後端 Trace 串接範例、OTel export to OpenSearch、SRE - 前端監控 - Proposal。新增兩份指定對話是補充 primary material；標準、source code 與現行核查各自保留 provenance。完整來源索引見 [RESOURCES.md](RESOURCES.md)。
