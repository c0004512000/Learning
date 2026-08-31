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
