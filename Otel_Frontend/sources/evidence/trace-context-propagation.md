# Frontend → backend trace-context propagation

## Question / scope

建立 Lesson 7 所需的 durable evidence：區分「trace context propagation」與「span telemetry export」，確認 `traceparent` 的欄位語意、Faro Web SDK 的 propagation wiring、內部 package `backendUrls` 的責任，以及 Jeter frontend/backend 目前能證明到哪裡。

## Verification metadata

- `verified_at`: 2026-09-17
- primary material: `sources/materials/6. 前後端 Trace 串接範例.html`
- supporting internal evidence:
  - `sources/evidence/faro-click-tracking.md`
  - `sources/evidence/jeter-integration-and-tracing.md`
- authoritative external source pointers:
  - `sources/linked/external/trace-context-and-faro-web-tracing.md`
- W3C source: Trace Context Recommendation, 2021
- Faro source checked: `grafana/faro-web-sdk` tag `v2.9.0`

## Verified findings

### 1. Propagation exists because Browser and backend are different runtimes

A frontend span/object only exists in Browser memory. The backend process cannot infer that in-memory parent relationship from the HTTP request URL/body alone. To continue one distributed trace across that process boundary, correlation context must be serialized into data that crosses the boundary. W3C Trace Context standardizes that HTTP representation as `traceparent` (with optional `tracestate`).

This is a different data path from exporting the completed span telemetry to Faro/Alloy/OTLP storage.

### 2. `traceparent` format and relationship semantics

For W3C version `00`:

```text
traceparent: 00-<32 hex trace-id>-<16 hex parent-id>-<2 hex trace-flags>
```

- `version`: current version format is `00`.
- `trace-id`: identifies the whole distributed trace; every participating span that remains in this trace uses the same trace ID.
- `parent-id`: identifies the caller's current operation/request context. In common tracing systems this is the caller span ID. For an outgoing browser HTTP request instrumented as a client span, the propagated parent ID represents that outbound operation.
- `trace-flags`: carries tracing flags such as the sampled bit; it is not a business result/status field.

Important relationship boundary:

```text
Browser client span
  traceId = T
  spanId  = A
      │ injects into HTTP request
      ▼
traceparent = 00-T-A-...
      │ backend extracts
      ▼
Backend server span
  traceId      = T
  spanId       = B   ← new ID for backend's own operation
  parentSpanId = A
```

The backend does **not** reuse `A` as its own span ID. It creates its own span and records `A` as the parent relationship while retaining trace ID `T`.

### 3. Faro Web SDK v2.9.0 propagation wiring

`packages/web-tracing/src/instrumentation.ts` verifies that Faro `TracingInstrumentation`:

- creates/registers a `WebTracerProvider`;
- uses `W3CTraceContextPropagator` by default unless a custom propagator is provided;
- reads `propagateTraceHeaderCorsUrls` from instrumentation options;
- passes that URL configuration into its default OTel instrumentations.

`packages/web-tracing/src/getDefaultOTELInstrumentations.ts` verifies that Faro's default browser tracing path constructs both Fetch and XHR instrumentation from those shared options.

Therefore URL matching, HTTP instrumentation, and W3C context serialization are separate responsibilities that combine to make header propagation possible.

### 4. Internal `@sre2/faro-click-tracking` boundary

Current package evidence verifies:

- public option `backendUrls` is passed to Faro `TracingInstrumentation` as `propagateTraceHeaderCorsUrls`;
- `backendUrls` means backend/business API URL patterns eligible for tracing propagation;
- it is **not** the Alloy/Faro telemetry receiver URL.

Teaching consequence: do not draw one arrow such as `backendUrls → Alloy`. There are two separate network paths:

```text
A. Business request / propagation
Browser application
  └─ HTTP request + traceparent ──> Backend API

B. Telemetry export
Browser Faro tracing
  └─ frontend span telemetry ──> Faro receiver / Alloy / Collector / trace backend

Backend tracing
  └─ backend span telemetry ──> OTLP / Collector / trace backend
```

Only after both sides export telemetry can a trace backend display the complete frontend + backend span tree. Propagation and export must not be treated as the same operation.

### 5. Cross-origin CORS boundary

Primary material 6 states that the backend must allow the `traceparent` header. For a cross-origin Browser → backend request, adding trace context participates in Browser CORS enforcement; the preflight/response policy must permit the actual request headers before the Browser can send the business request under those conditions.

This reuses the CORS model established in Lessons 5–6 but applies it to the **business backend request**, not to the `/alloy` telemetry POST.

### 6. Jeter current configuration evidence

Existing Jeter evidence verifies configuration, not end-to-end runtime correlation:

Frontend:

- `backendUrls` is `[new RegExp(BACKEND_URL)]`.
- Scenario calls use `${BACKEND_URL}${path}`.

Backend:

- ASP.NET Core OpenTelemetry tracing is enabled.
- CORS allows configured frontend origins and headers.
- Backend spans export through OTLP.

This is sufficient to teach the intended propagation chain and where to inspect it.

## What is NOT proven

The bounded runtime evidence currently does **not** prove all of the following for one concrete Jeter request:

1. Browser Network captured a business API request containing a concrete `traceparent` value.
2. The backend server span extracted that exact remote parent context.
3. Browser client span and backend server span were observed in Tempo with the same trace ID and the expected parent/child relationship.

Those are Lesson 8 runtime-verification goals. Lesson 7 must not present them as already proven facts.

## Failure-model implications

- API request succeeds but no `traceparent` is sent: business functionality may still work while backend tracing starts an independent trace.
- `traceparent` is present but backend tracing does not extract/use it: the header alone does not prove the backend joined the trace.
- Propagation works but frontend telemetry export fails: backend may continue the same trace ID, yet the frontend parent span can be missing from the trace backend.
- Frontend and backend both export spans but trace IDs differ: propagation/join failed somewhere before storage correlation.

## Course relevance

- Direct basis for Lesson 7: first-principles propagation mental model and package responsibility boundaries.
- Direct basis for Lesson 8: defines the three runtime observations required before claiming end-to-end join success.
- Reused by Lesson 12: separates propagation failure, telemetry-export failure, CORS failure, and storage visibility failure into distinct fault domains.
