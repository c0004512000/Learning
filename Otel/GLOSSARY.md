# OpenTelemetry Glossary

這是本教學工作區的 canonical terminology。後續課程、練習與學習紀錄都使用下列定義。

## Trace model

**Trace**:
一次端到端 operation 的完整因果路徑，由共用同一個 Trace ID 的多個 Span 組成樹狀結構。
_Avoid_: Request log

**Span**:
Trace 中一個有起訖時間的工作單元；它有自己的 Span ID，並可透過 Parent Span ID 形成父子關係。
_Avoid_: Trace step

**Trace ID**:
同一條 Trace 中所有 Span 共用的識別碼。
_Avoid_: Request ID

**Span ID**:
一個 Span 在其 Trace 內的識別碼；child Span 的 Parent Span ID 會指向 parent Span 的 Span ID。
_Avoid_: Child ID

**Parent Span ID**:
一個 Span 的直接 parent Span 的 Span ID；沒有 Parent Span ID 的 Span 是 root span。
_Avoid_: Parent trace ID

**Attribute**:
附加在 telemetry 上的 key-value metadata，用於描述和查詢被觀測的 operation；屬性命名優先遵循 OTel Semantic Conventions。
_Avoid_: Span ID metadata

**Context propagation**:
將 Span Context 序列化到跨 execution boundary 的 carrier，並在接收端取出，讓新的 Span 延續原本的 Trace 關係；HTTP 預設使用 W3C `traceparent` header。
_Avoid_: Sending the entire span

## Tracing SDK building blocks

**Instrumentation**:
在 application 或 library 中加入產生 telemetry 的程式碼，讓特定 operation 被 Span 或其他 signal 描述。
_Avoid_: Backend configuration

**Tracing API**:
不綁定 vendor 的操作契約；埋點程式透過它取得 Tracer、建立 Span，而不必知道資料最後送去哪裡。
_Avoid_: Tracing backend

**SDK**:
Tracing API 的具體實作；負責依設定記錄 Span、交給 Processor 處理，再由 Exporter 輸出。
_Avoid_: Storage backend

**TracerProvider**:
通常在 application startup 建立的 tracing 設定擁有者；它建立或提供 Tracer，並持有共用的 SDK configuration。
_Avoid_: Span transport

**Tracer**:
由 TracerProvider 提供、供埋點程式重複使用的操作入口；它用來建立 Span，不是資料庫或 Exporter。
_Avoid_: Trace database

**SpanProcessor**:
SDK 中接手 Span lifecycle 資料的元件；本課聚焦 Span 結束後，它如何把已完成的 Span 交給 Exporter。
_Avoid_: Final destination

**BatchSpanProcessor**:
一種 SpanProcessor；先把結束的 Span 放入暫存佇列，再以批次方式交給 Exporter，以降低每次 operation 的直接輸出成本。
_Avoid_: Trace backend

**Exporter**:
把 SDK 產生的 telemetry 轉送到具體目的地的 adapter；目的地可以是 terminal、Collector 或其他 backend。
_Avoid_: Span creator

**ConsoleSpanExporter**:
把 Span 輸出到 terminal 的 Exporter，適合本機觀察資料結構與除錯；它不是可查詢、可長期保存的 tracing backend。
_Avoid_: Production trace database

**Tracing pipeline**:
SDK 中由 Provider、Processor 與 Exporter 組成的可重用處理路徑；Span 結束後沿著這條路徑被處理並輸出。
_Avoid_: Trace parent-child tree

## HTTP attributes and aggregation

**HTTP route**:
HTTP server framework 匹配到的低基數 route template；dynamic path segment 必須以 placeholder 表示，例如 `/users/{userId}`，而不是實際 URI path。
_Avoid_: Actual path, API endpoint

**Logical API operation**:
HTTP request method 與 HTTP route 的組合，例如 `GET /users/{userId}`；它描述穩定的操作，通常也是 server Span 的名稱。
_Avoid_: Endpoint（未說明是 method、route、host 或完整 URL 時）

**Actual request URL**:
一次 HTTP 請求實際使用的 URL，例如 `https://api.example.com/users/42?expand=orders`；`url.full` 可表達這類資料，但值可能是高基數且含敏感資訊。
_Avoid_: HTTP route

**Cardinality（基數）**:
在指定範圍內一個 Attribute 可出現的唯一值數量；對 metrics 而言，cardinality 是所有 measurement Attributes 的唯一組合數量。
_Avoid_: Attribute count, data volume
