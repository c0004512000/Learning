# Faro 前後端可觀測性 Resources

## Source policy

`sources/materials/` 的原始 8 份 HTML 仍為課程主軸；使用者於 2026-10-22 指定的兩份主／支線對話補強既有教材。`sources/linked/` 保存實際引用來源；`sources/evidence/` 保存有適用日期與版本的核查結果。外部資料只用於必要 prerequisite、標準、歧義或版本驗證；不靜默覆蓋原文件。Generated `reference/` 與原始來源分開。

## Primary learning corpus

- [原始 8 份 HTML](sources/materials/)：需求、Faro／Alloy、內部套件、歷史、部署、前後端 Trace、OpenSearch pipeline 與提案。
- [2026-10-22 主線／Queue 支線來源索引](sources/materials/2026-10-22-faro-conversation-materials.md)：檔名、SHA-256、主支線關係、知識點與缺漏範圍。原始附件保留於該次對話；本 repo 的索引不是偽稱完整的對話副本。

## Authoritative product / implementation references

| 來源 | 使用邊界 |
|---|---|
| [W3C Trace Context Recommendation](https://www.w3.org/TR/trace-context-1/) | traceparent／tracestate、ID 與 incoming/outgoing context。 |
| [Grafana Alloy otelcol.receiver.faro](https://grafana.com/docs/alloy/latest/reference/components/otelcol/otelcol.receiver.faro/) | Receiver、CORS、output；對照實際部署版本，不把 latest 視為歷史環境。 |
| [Faro instrumentation](https://grafana.com/docs/grafana-cloud/observe-and-act/monitor-applications/frontend-observability/instrument/) | 預設與選配能力背景。 |
| [Faro Web SDK repository](https://github.com/grafana/faro-web-sdk) | 一手 implementation 入口；具體教材引用固定版本。 |
| [v2.9.0 TracingInstrumentation](https://github.com/grafana/faro-web-sdk/blob/v2.9.0/packages/web-tracing/src/instrumentation.ts) | Lesson 7 的 W3C propagator 與 registration source basis。 |
| [v2.9.0 default OTel instrumentations](https://github.com/grafana/faro-web-sdk/blob/v2.9.0/packages/web-tracing/src/getDefaultOTELInstrumentations.ts) | Shared options 如何進入 Fetch／XHR。 |
| [v2.12.1 FetchTransport](https://github.com/grafana/faro-web-sdk/blob/v2.12.1/packages/web-sdk/src/transports/fetch/transport.ts) | 接續 IDP 10/05 evidence 的 receiver exclusion 與 upload。 |
| [v2.12.1 TracingInstrumentation](https://github.com/grafana/faro-web-sdk/blob/v2.12.1/packages/web-tracing/src/instrumentation.ts) | Resource、ignore URLs、預設 BSP 1000 ms／30 spans；有替代 processor 時不可直接套用。 |
| [v2.12.1 FaroTraceExporter](https://github.com/grafana/faro-web-sdk/blob/v2.12.1/packages/web-tracing/src/faroTraceExporter.ts) | Span export → Faro API 的 handoff；不等於持久化。 |
| [v2.12.1 BatchExecutor](https://github.com/grafana/faro-web-sdk/blob/v2.12.1/packages/core/src/transports/batchExecutor.ts) | 250 ms 固定 timer、50 TransportItems、meta 分組與 private flush。 |
| [v2.12.1 Transport types](https://github.com/grafana/faro-web-sdk/blob/v2.12.1/packages/core/src/transports/types.ts) | TransportItem 與 body 的 events／logs／exceptions／measurements／traces 分類。 |
| [OTel SpanKind](https://opentelemetry.io/docs/specs/otel/trace/api/#spankind) | Span 的操作角色，不是 frontend／backend 的分類。 |
| [OTLP JSON encoding](https://opentelemetry.io/docs/specs/otlp/#json-protobuf-encoding) | Trace/span IDs 的 hex 規則；與一般 protobuf bytes 表示區別。 |
| [Collector Faro translator](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/aad2838d6990eb031e7f4913269c3153cb5c2b4a/pkg/translator/faro/logs_to_faro.go) | 欄位轉換與 event_data_ prefix 的歷史 source。 |
| [filter v0.101](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/release/v0.101.x/processor/filterprocessor/README.md) | 舊版設定的條件為真即丟棄語意。 |
| [transform v0.101](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/release/v0.101.x/processor/transformprocessor/README.md) | 舊版 OpenSearch body 展平與 OTTL 限制。 |
| [Web Vitals](https://web.dev/articles/vitals?hl=zh-tw) | LCP／INP／CLS 的背景查表，不自動納入本次導入範圍。 |

[本次固定版本、blob 與標準核查詳表](sources/linked/external/faro-trace-batching-2026-10-22.md)。PR #37 的 app.name 實作鏈另見 [2026-10-12 evidence](sources/evidence/faro-app-name-otel-service-name-2026-10-12.md)，不與其他 Faro 版本混用。

## Authoritative prerequisite references

- [MDN JavaScript technologies overview](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/JavaScript_technologies_overview)與 [Language and runtime](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Language_overview)：core language／Browser host／DOM／network ownership。
- [WHATWG Document](https://html.spec.whatwg.org/multipage/dom.html)與 [MDN querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector)：runtime DOM、Document object、selector。
- [WHATWG Events](https://dom.spec.whatwg.org/#events)、[EventTarget](https://dom.spec.whatwg.org/#interface-eventtarget)、[MDN addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)：event path、listener 與 callback。
- [MDN Callback](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function)：function reference 與呼叫責任，callback 不等於 async。
- [MDN CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)與 [ASP.NET Core CORS](https://learn.microsoft.com/en-us/aspnet/core/security/cors?view=aspnetcore-10.0)：safelisted／preflight／headers 與完整 policy 條件。教材片段不是可直接替換既有服務的完整 Program.cs。

## Internal operational references

以下保留既有來源指標與當時文件版本，**不是本次重新確認的部署狀態或登入權限**：

- Confluence `PI 前端監控案例`（page 2191682813，v41）及其餘 7 份對應頁面。
- Confluence `升級 Otel Stack`（page 2193332516，v124）；既有紀錄的 test/stage Collector 0.158.0、prod 0.101.0 需按採集日期解讀。
- Confluence `Application for DE service`（page 1753987876，v92）：production index／mapping／權限流程。
- Confluence `OpenSearch Connection`（page 1936342304，v47）：endpoint 與帳號責任；不保存 credential。

先前 evidence 曾透過 gh、Grafana、OpenSearch 與 Kubernetes 查核內部環境。這些是歷史採證能力，不代表目前 session 有相同網路、帳號或 token；本次只作 repository／公開 source 核查與離線教學檢查，未重新查詢內部 runtime。

## Durable evidence index

| Evidence | 內容與日期邊界 |
|---|---|
| [faro-click-tracking](sources/evidence/faro-click-tracking.md) | 內部 package click／user／device／environment／singleton 與歷史 unknown。 |
| [Foreman integration](sources/evidence/foreman-integration.md) | 宿主整合、DOM placement、PrimeNG 與原有 runtime images。 |
| [data-link-name investigation](sources/evidence/data-link-name-investigation-2026-09-17.md) | Pinned source history 與 semantic bridge；不宣稱最新遠端 HEAD。 |
| [template inventory](sources/evidence/data-link-name-clickable-inventory-2026-09-17.md) | 宣告數與標記範圍，不是 runtime DOM 數量。 |
| [Jeter integration](sources/evidence/jeter-integration-and-tracing.md) | 歷史 frontend/backend 設定；後續 runtime join 證明另見 09/20 evidence。 |
| [trace propagation](sources/evidence/trace-context-propagation.md) | W3C／Faro wiring 與 propagation/export 邊界；保留原核查時的限制。 |
| [09/20 frontend/backend runtime](sources/evidence/frontend-backend-trace-runtime-2026-09-20.md) | 單筆 Browser header → spans → backend parent 的實際 join 證據。 |
| [browser-to-alloy](sources/evidence/browser-to-alloy.md) | Environment resolver、receiver、歷史 OPTIONS verification。 |
| [Foreman DevTools lab](sources/evidence/foreman-browser-debug-lab.md) | Browser 面板操作與真實 visual evidence。 |
| [09/21 resource runtime](sources/evidence/faro-performance-resource-runtime-2026-09-21.md) | 不同 telemetry POST、Resource event → log/Loki。 |
| [Collector pipeline](sources/evidence/collector-pipeline.md) | 歷史 topology／版本／processors／routing。 |
| [OpenSearch lifecycle](sources/evidence/opensearch-field-lifecycle.md) | Field translation／mapping／index／cluster。 |
| [Grafana state](sources/evidence/grafana-current-state.md) | 當時 Dashboard／datasource 與 query-surface 限制。 |
| [10/05 IDP Portal](sources/evidence/idp-portal-keychain-runtime-2026-10-05.md) | Exact correlation、mixed batches、sampling／buffering 與大小寫 mismatch。 |
| [10/12 app.name source](sources/evidence/faro-app-name-otel-service-name-2026-10-12.md) | PR #37：Resource service.name assignment 與 override order。 |
| [10/22 conversations](sources/evidence/faro-conversation-verification-2026-10-22.md) | 來源敘述、版本核查、疑點與逐項教材 coverage。 |
| [10/22 integration QA](sources/evidence/learning-integration-qa-2026-10-22.md) | 本次實際執行的教材／互動檢查與未完成的部署驗證。 |
| [Evidence Gap Report](EVIDENCE-GAP-REPORT.md) | 既有 claim-by-claim 限制；新情況依 dated evidence 補充，不靜默重寫歷史。 |

[Internal linked pointers](sources/linked/internal/) · [External linked pointers](sources/linked/external/)。

## Wisdom / operational review

內部 PI SRE／平台維護者與原專案 reviewer：用於 production 變更、collector domain、index mapping、KPI 定義與未文件化慣例；不以模型推論代替團隊契約或 runtime 證據。
