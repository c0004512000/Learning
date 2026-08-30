# OpenTelemetry (OTel) Resources

## Knowledge

- [OpenTelemetry 官方文件](https://opentelemetry.io/docs/)
  最權威、廠商中立的起點。涵蓋 concepts、各語言 instrumentation guide、Collector 架構。每一課都應優先引用這裡的頁面。
- [OTel Concepts](https://opentelemetry.io/docs/concepts/)
  核心概念說明:signals (traces/metrics/logs)、context propagation、SDK vs API 的區別。適合建立心智模型時使用。
- [OTel Observability Primer](https://opentelemetry.io/docs/concepts/observability-primer/)
  從「如何由系統輸出理解內部狀態」推導 observability、traces、metrics 與 logs 的角色。用於不假設前置知識的第一性原理課程。
- [OTel Traces](https://opentelemetry.io/docs/concepts/signals/traces/)
  Trace、Span、Span Context、attributes、events、links 與 status 的官方概念說明。用於建立 trace 資料模型與判讀能力。
- [OTel Context Propagation](https://opentelemetry.io/docs/concepts/context-propagation/)
  說明跨 process/network boundary 時如何透過 W3C `traceparent` 傳遞 Trace ID 與 parent Span ID。用於分散式 tracing 的 debug 與實作。
- [OTel Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/)
  canonical 的屬性名稱、型別、意義與有效值定義。用於判讀或設計 span/resource/metric/log attributes，避免自訂且不可互通的 key。
- [OTel HTTP Span Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/http/http-spans/)
  HTTP client/server span 的 span name、kind、status 和 attributes 規範。用於最常見的 HTTP trace 判讀與埋點設計。
- [OTel Metrics — Cardinality limits](https://opentelemetry.io/docs/concepts/signals/metrics/#cardinality-limits)
  說明 metric cardinality 是 unique attribute combinations、SDK 預設限制與 overflow 行為。用於設計 metrics attributes 與控制記憶體/儲存成本。
- [OTel Python 官方文件](https://opentelemetry.io/docs/languages/python/)
  Python SDK/API 的安裝、手動埋點、自動埋點方式。所有 Python 練習程式碼的依據來源。
- [OTel Python Manual Instrumentation](https://opentelemetry.io/docs/languages/python/instrumentation/)
  Python application 的 API/SDK 分工、TracerProvider、Tracer、Span 與 exporter 設定範例。用於手動埋點練習與 SDK pipeline 的理解。
- [OTel Tracing SDK Specification](https://opentelemetry.io/docs/specs/otel/trace/sdk/)
  TracerProvider、SpanProcessor、sampling 與 exporter 的責任邊界。用於理解 SDK pipeline 的設計，而不是只記憶 Python 類別名稱。
- [OTel Collector 文件](https://opentelemetry.io/docs/collector/)
  Collector 的 receivers/processors/exporters/pipeline 設定與production best practice。導入維運階段的核心參考。
- [Awesome OpenTelemetry (GitHub curated list)](https://github.com/magsther/awesome-opentelemetry)
  社群整理的教學資源、書籍、影片、實作 lab 清單,可用來補足特定主題的深度資源。
- [SRE Manager's Guide to OpenTelemetry — Elastic](https://www.elastic.co/resources/article/opentelemetry-otel-sre-manager-guide)
  以 SRE 視角談 OTel 導入策略與常見陷阱,適合「導入維運」相關課程的背景閱讀。

## Wisdom (Communities)

- [CNCF Slack](https://slack.cncf.io) — 頻道 `#opentelemetry`、`#otel-sig-end-user`、`#otel-collector`
  最活躍的即時討論社群,maintainer 與資深使用者常在此回覆問題。`#otel-sig-end-user` 適合問「怎麼導入」類型的問題。
- [OpenTelemetry End User Resources](https://opentelemetry.io/community/end-user/)
  官方整理的社群資源入口,含論壇、podcast、issue tracker 連結。

## Gaps
- 尚未找到針對「設計內部 observability agent」這種進階目標的專門教材,未來需要進一步搜尋 OTel Collector 客製化 processor/extension 開發的資源(Go 為主,但概念可轉譯）。
