# Faro 前後端可觀測性 Resources

## Source policy

`sources/materials/` 內的 8 份使用者提供 HTML 是本 learning workspace 的第一線主軸與學習邊界。`sources/linked/` 只保存本輪實際使用的明確引用；`sources/evidence/` 保存可重用的 verified findings。外部官方資料只用來：補文件省略的 prerequisite、驗證文件敘述、消除歧義，或提供理解文件所必要的背景；不靜默覆蓋原文件。

## Primary learning corpus

- [本地主要來源：8 份 HTML](sources/materials/)
  第一線課程語料，涵蓋需求、Faro／Alloy、套件實作與歷史、部署、前後端 Trace、OpenSearch pipeline 與專案提案。

## Authoritative product / implementation references

- [Grafana Alloy `otelcol.receiver.faro`](https://grafana.com/docs/alloy/latest/reference/components/otelcol/otelcol.receiver.faro/)
  Receiver、CORS、輸出與 stability 的現行官方規格；用來校正文內版本敘述與設定。
- [Grafana Faro instrumentation](https://grafana.com/docs/grafana-cloud/observe-and-act/monitor-applications/frontend-observability/instrument/)
  Faro 官方 instrumentation 與前端觀測能力；用於理解 SDK 預設與選配行為。
- [Grafana Faro Web SDK repository](https://github.com/grafana/faro-web-sdk)
  SDK、web tracing 與 `propagateTraceHeaderCorsUrls` 的一手實作來源。
- [OpenTelemetry Collector Faro translator](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/aad2838d6990eb031e7f4913269c3153cb5c2b4a/pkg/translator/faro/logs_to_faro.go)
  Faro payload 轉成 OTel logs 時的欄位命名與 `event_data_` 前綴來源。
- [OTel filter processor v0.101](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/release/v0.101.x/processor/filterprocessor/README.md)
  舊版 production／stage 設定所依據的 filter 語意；特別注意條件為真代表丟棄。
- [OTel transform processor v0.101](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/release/v0.101.x/processor/transformprocessor/README.md)
  OpenSearch body 展平與 OTTL 版本限制的官方依據。
- [Web Vitals](https://web.dev/articles/vitals?hl=zh-tw)
  LCP、INP、CLS 等使用者體驗指標的一手背景資料。

## Authoritative prerequisite references

這些不是 Faro 主線教材，而是只有在 source documents 省略必要 browser / language 基礎時才使用。

- [WHATWG HTML Standard — Document](https://html.spec.whatwg.org/multipage/dom.html)
  用於理解 JavaScript 裡的 `document` 與 HTML document 對應的 `Document` object。
- [WHATWG DOM Standard — Events](https://dom.spec.whatwg.org/#events)
  用於理解 Event object、event target、event path 與 event dispatch。
- [WHATWG DOM Standard — EventTarget](https://dom.spec.whatwg.org/#interface-eventtarget)
  用於理解 listener registration、`addEventListener()` 與 callback 的責任邊界。
- [MDN — Callback function](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function)
  用於補 callback 的語言層概念，以及 callback 不等於 async。
- [MDN — EventTarget.addEventListener()](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
  較容易閱讀的日常 JavaScript 對照資料。

## Internal operational references

- Confluence `PI 前端監控案例`（page 2191682813，v41）及其餘 7 份對應頁面。
  用於核對本地 HTML 是否對應現行內容與版本。
- Confluence `升級 Otel Stack`（page 2193332516，v124）。
  用於判斷各環境 Collector／Tempo／Loki 版本與升級歷史；目前文件記載 test、stage 已到 Collector 0.158.0，prod 仍為 0.101.0。
- Confluence `Application for DE service`（page 1753987876，v92）。
  用於 production OpenSearch index 申請、mapping 與權限流程。
- Confluence `OpenSearch Connection`（page 1936342304，v47）。
  用於環境 endpoint、帳號責任邊界與連線檢查；不在學習文件保存任何密碼或秘密內容。

## Runtime evidence

- Garmin GitHub 可透過使用者既有 `gh` 帳號唯讀存取；已核對套件、Foreman PR #21、Jeter `dev` 與 stage/prod Helm。
- Grafana stage/prod API token 可用；已讀 Foreman dashboard 與 Loki/Tempo datasource。
- OpenSearch stage/prod 帳號可用；已驗證 Foreman index 所在 cluster，不讀取真實使用者文件內容。
- Kubernetes `tw-test`／`tw-stage`／`tw-prod` 可唯讀查詢；已核對 Collector 與 Alloy runtime。

## Durable evidence index

- [`sources/evidence/faro-click-tracking.md`](sources/evidence/faro-click-tracking.md)：package click/user/device/environment/singleton contract 與歷史 unknown。
- [`sources/evidence/foreman-integration.md`](sources/evidence/foreman-integration.md)：Foreman host integration、DOM placement、PrimeNG boundary 與 runtime images。
- [`sources/evidence/jeter-integration-and-tracing.md`](sources/evidence/jeter-integration-and-tracing.md)：Jeter frontend/backend tracing configuration 與 runtime join gap。
- [`sources/evidence/browser-to-alloy.md`](sources/evidence/browser-to-alloy.md)：environment resolver、Alloy receiver、CORS preflight。
- [`sources/evidence/collector-pipeline.md`](sources/evidence/collector-pipeline.md)：stage/prod Collector topology、versions、processors、routing。
- [`sources/evidence/opensearch-field-lifecycle.md`](sources/evidence/opensearch-field-lifecycle.md)：Faro field translation、mapping、index 與 cluster routing。
- [`sources/evidence/grafana-current-state.md`](sources/evidence/grafana-current-state.md)：dashboard/datasource current state 與 query-surface conflict。
- [`EVIDENCE-GAP-REPORT.md`](EVIDENCE-GAP-REPORT.md)：claim-by-claim status、缺口與 troubleshooting readiness。

本輪實際使用的 linked source pointers：[`sources/linked/internal/`](sources/linked/internal/)（Garmin repos、Confluence pointers）與 [`sources/linked/external/`](sources/linked/external/)（PrimeNG、Faro translator、processor semantics）。

## Wisdom (Communities)

- 內部 PI SRE／平台維護者與既有 PR reviewer。
  用於核對 production 變更、泰國 collector domain、index mapping 與未文件化的操作慣例。
