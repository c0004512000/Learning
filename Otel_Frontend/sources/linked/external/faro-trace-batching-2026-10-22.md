# Faro trace / batching 核查來源

核查日期：2026-10-22。來源用來核對本次指定對話中的標準語意與版本化實作，不代表重新驗證使用者的內部部署。

| 來源 | 用途／版本 |
|---|---|
| [Faro v2.12.1 BatchExecutor](https://github.com/grafana/faro-web-sdk/blob/v2.12.1/packages/core/src/transports/batchExecutor.ts) | blob `ddd02d413fef82c833c6b3bd6583e1a28ecf2b61`；250 ms interval、50 items、hidden、meta 分組、private flush。 |
| [Faro v2.12.1 TracingInstrumentation](https://github.com/grafana/faro-web-sdk/blob/v2.12.1/packages/web-tracing/src/instrumentation.ts) | blob `3efc3c1572a8c0b862b671c5c3ec7838ba3ce93d`；預設 BSP 1000 ms／30 spans、替代 processor、Resource 與 transport ignore URLs。 |
| [Faro v2.12.1 FaroTraceExporter](https://github.com/grafana/faro-web-sdk/blob/v2.12.1/packages/web-tracing/src/faroTraceExporter.ts) | 接續既有 2026-10-05 evidence 的 span export → Faro API handoff。 |
| [Faro v2.12.1 FetchTransport](https://github.com/grafana/faro-web-sdk/blob/v2.12.1/packages/web-sdk/src/transports/fetch/transport.ts) | 接續既有 2026-10-05 evidence 的 collector exclusion 與 HTTP transport 邊界。 |
| [Faro v2.12.1 Transport types](https://github.com/grafana/faro-web-sdk/blob/v2.12.1/packages/core/src/transports/types.ts) | blob `35f762f1167766f6142a7b3c4eac474479f2d25b`；TransportItem 與五種 body keys。 |
| [W3C Trace Context](https://www.w3.org/TR/trace-context/) | trace-id／parent-id／flags；基本關聯與 vendor tracestate 的不同角色。 |
| [OpenTelemetry Trace API — SpanKind](https://opentelemetry.io/docs/specs/otel/trace/api/#spankind) | CLIENT／SERVER 是 span 的操作角色，不能當成 Browser／backend 身分。 |
| [OTLP JSON Protobuf Encoding](https://opentelemetry.io/docs/specs/otlp/#json-protobuf-encoding) | OTLP JSON 對 traceId／spanId 規定 hex；區別 generic protobuf JSON bytes 的 Base64。 |
| [MDN CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS) | origin、safelisted request、preflight 與 response access 邊界。 |
| [ASP.NET Core CORS](https://learn.microsoft.com/en-us/aspnet/core/security/cors?view=aspnetcore-10.0) | WithOrigins、WithMethods、WithHeaders、credentials 與 middleware policy；教材片段不是完整服務設定。 |

自訂內部 SDK 若覆寫預設值，須以 resolved artifact／實際配置為準。上述版本化 source 不可用來宣稱其他 SDK 版本或部署採相同設定。
