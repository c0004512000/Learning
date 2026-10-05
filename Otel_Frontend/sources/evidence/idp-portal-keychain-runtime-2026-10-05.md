# IDP Portal Faro / Keychain runtime verification — 2026-10-05

## Purpose

Preserve the reusable runtime evidence produced after Faro was integrated into IDP Portal on `tw-stage`.

This evidence is intentionally organized around durable observability boundaries rather than the chronological Keychain debugging conversation. It supports Lessons 5–9 and future production troubleshooting without turning the course into a Keychain-specific curriculum.

## Verification metadata

- Environment: `tw-stage`
- Frontend service: `idp-portal`
- Observed frontend version: `0.3.0-brandon-faro`
- Faro Web SDK observed in the deployed bundle / spans: `2.12.1`
- OpenTelemetry JS SDK observed in spans: `2.11.0`
- Faro receiver resolved by the internal SDK: `https://pek8s-staging.garmin.com/alloy`
- Evidence capture date: 2026-10-05
- Source bundle SHA-256 (decoded UTF-8 text): `79199abe1533ed5817e82dd5f0fd8c4926098027afb6f1d4c9f461b2ca7d7075`

The original evidence package contains sanitized JSON projections rather than a complete HAR. Credentials, Cookie, Authorization, and credential request/response bodies are intentionally absent.

## 1. Exact Browser → Alloy → Tempo correlation from a read-only request

A read-only environments request provides an exact correlation chain that does not depend on time-window guessing.

Browser Network:

```text
GET /idp-keychain-api/api/teams/sre/environments?...  -> 200

traceparent =
00-96c10f7c2345a2c749a78833f964b8e4-51bd7d311cc1fd4d-01
```

The second field is trace ID `96c10f7c2345a2c749a78833f964b8e4`.  
The third field is caller/client span ID `51bd7d311cc1fd4d`.

The later Faro upload containing tracing data carried:

```text
traceId = 96c10f7c2345a2c749a78833f964b8e4
spanId  = 51bd7d311cc1fd4d
URL     = .../api/teams/sre/environments?...
```

Tempo stored the same trace and showed:

```text
frontend CLIENT spanId = 51bd7d311cc1fd4d
backend SERVER spanId  = e225fd2b63254d9f
backend parentSpanId   = 51bd7d311cc1fd4d
```

The saved correlation check also verified exact URL and span timestamp equality.

Therefore, for this one request:

```text
Browser traceparent trace-id
  == Alloy span traceId
  == Tempo trace ID

Browser traceparent parent-id
  == Alloy frontend spanId
  == Tempo frontend CLIENT spanId
  == Tempo backend SERVER parentSpanId
```

This independently corroborates the trace-context model already established with Jeter.

## 2. `traceparent` sampled flag is not storage acknowledgement

The observed header ended in `01`.

For version `00`, the low sampled bit is set in this context. It does **not** prove any of these later boundaries succeeded:

- Faro export;
- HTTP delivery to the receiver;
- downstream sampling/filtering;
- Collector processing;
- Tempo persistence;
- later Tempo query visibility.

Tempo persistence for the read-only request is established by the separate exact Tempo lookup, not inferred from `01`.

A later runtime snapshot showed the current IDP Portal session was selected by session-based sampling, with no configured custom session sampler or sampling rate and SDK fallback rate `1`. That snapshot belongs to the later session and must not be retroactively treated as the historical read-only session state. Backend / Alloy / Collector sampling policies were not inspected.

## 3. A Faro upload is a batch, not a business-request envelope

The read-only reload captured four business XHR GETs and two `POST /alloy` requests.

Batch A:

```text
status: 202
payload keys: meta, events, measurements
events: session_resume, faro.performance.navigation,
        four faro.performance.resource events
measurement: web-vitals
trace spans: 0
```

Batch B:

```text
status: 202
payload keys: meta, traces, events
events: four faro.tracing.xml-http-request events
trace spans: 4
```

The four tracing spans correspond to four different business XHR traces.

This establishes several reusable boundaries:

- one `/alloy` POST can contain several telemetry items;
- one batch can mix signal categories;
- a batch can contain no traces at all;
- one business request is not assigned to one fixed `/alloy` POST;
- request order cannot be used to infer which batch contains a given trace.

The fastest trace workflow is therefore:

```text
business request
  -> read traceparent
  -> use exact trace ID in Tempo
  -> inspect Alloy payload only when validating SDK delivery/content
```

## 4. Receiver HTTP 202 and Tempo/Loki persistence are different claims

Both captured Faro uploads returned HTTP 202.

That response proves the receiver accepted the HTTP request at that boundary. It does not prove storage.

For the tested traces, persistence was verified separately through Tempo API queries. The credential-creation tracing event was also verified separately in Loki.

Keep these claims distinct:

```text
POST /alloy -> 202
  = receiver HTTP acceptance

exact trace in Tempo
  = trace storage/query visibility

matching record in Loki
  = log/event storage/query visibility
```

## 5. Transport buffering happens before the Network POST

The deployed bundle exposes two separate batching stages:

1. OpenTelemetry span batching:
   - scheduled delay: 1000 ms
   - max export batch size: 30
2. Faro signal batching:
   - send timeout: 250 ms
   - item limit: 50
   - grouping by metadata
   - visibility can also trigger flush

These values are buffer/flush controls, not a guaranteed Network cadence.

For a completed sampled span, the observed implementation path is:

```text
span.end()
  -> OTel BatchSpanProcessor queue
  -> FaroTraceExporter
  -> Faro api.pushTraces()
  -> Faro signal buffer / batching
  -> transport builds HTTP body
  -> POST /alloy
```

Therefore "span entered a buffer" must not be taught as "span has been uploaded" or "span has been persisted".

## 6. The transport URL is excluded from frontend HTTP tracing

The deployed Faro v2.12.1 implementation contains the equivalent of:

```text
FetchTransport.getIgnoreUrls()
  -> [this.options.url, ...configuredIgnoreUrls]

TracingInstrumentation
  -> collects transport ignore URLs
  -> passes them to Fetch/XHR instrumentation
```

For this deployment, the transport URL is `https://pek8s-staging.garmin.com/alloy`.

This means the normal Browser HTTP tracing path excludes its own Faro delivery URL, preventing the telemetry upload request from recursively becoming another frontend HTTP span to export.

This is a frontend tracing exclusion. It does not claim that no server-side component can trace a receiver request.

Versioned upstream source basis preserved by the evidence package:

- Grafana Faro Web SDK v2.12.1 `packages/web-sdk/src/transports/fetch/transport.ts`
- Grafana Faro Web SDK v2.12.1 `packages/web-tracing/src/instrumentation.ts`
- Grafana Faro Web SDK v2.12.1 `packages/web-tracing/src/getDefaultOTELInstrumentations.ts`
- Grafana Faro Web SDK v2.12.1 `packages/web-tracing/src/faroTraceExporter.ts`

## 7. Credential creation: useful latency evidence with a weaker correlation boundary

One Keychain creation operation returned HTTP 201 and produced a stored trace:

```text
frontend idp-portal POST                    48.100 s
└─ IDP-Keychain-API SERVER                  48.026 s
   ├─ IAM topology GET client               11.928 ms
   ├─ Credential Management team resources 768.871 ms
   ├─ Credential Management app 36231 POST  47.240 s
   └─ Credential Management app 36229 POST  14.034 s
```

The two long downstream calls overlap; their durations must not be added.

The long outgoing client span identifies where the Keychain API experienced waiting. It does **not** establish the remote Credential Management service's internal CPU, DB, lock, retry, or network root cause because a corresponding downstream SERVER span was not present in the saved trace.

Important evidence limitation:

- the creation request's outgoing Network `traceparent` was not retained;
- the creation Alloy payload was not retained;
- correlation therefore uses action time, URL, method, status, the stored Tempo span tree, and the matching Loki tracing event.

Do not present this creation case as the same strength of exact Browser-header correlation as the read-only request above.

## 8. Query identity can hide valid telemetry

The deployed application explicitly initializes:

```text
app.name = "idp-portal"
environment = "tw-stage"
```

The app name is passed through to tracing `service.name`; no lowercase conversion was observed in the mapping.

During the 11:25–11:30 UTC+8 window:

```text
Tempo service = "IDP-Portal"          -> 0
Tempo service = "idp-portal" + POST   -> 1 creation trace

Loki service_name = "IDP-Portal"      -> 0
Loki service_name = "idp-portal"      -> 22 records
```

The dashboard Job selection was `IDP-Portal`, while actual telemetry identity was `idp-portal`.

This is a query/configuration mismatch, not evidence that telemetry was absent.

A separate namespace caveat was also observed: some dashboard panels use `k8s_namespace_name=~"$Namespace"` while the All value can expand to literal `all`. This affects only panels that use that filter and must not be generalized to every panel.

For Loki in this configuration, `trace_id` worked as a pipeline metadata filter rather than as an indexed stream selector for the tested record.

## 9. Durable teaching implications

Use this evidence to strengthen these course boundaries:

- **Lesson 5:** transport unit vs telemetry unit; buffering vs delivery; receiver self-tracing exclusion.
- **Lesson 6:** start from the business request; use `traceparent` as the fastest exact key; inspect Alloy only for SDK-delivery questions.
- **Lesson 7:** `parent-id` is the caller span ID; `01` is sampled context, not persistence.
- **Lesson 8:** distinguish exact Browser-header correlation from weaker time/URL/service search; decode ID representations before comparing; persistence needs storage evidence.
- **Lesson 9:** one Faro batch can mix signals or contain no traces; HTTP acceptance and storage visibility remain separate.
- **Lesson 12:** query identity / dashboard filter mismatches are an independent fault domain from telemetry generation and ingestion.

## Limits

- No credential secret values are retained.
- Credential plaintext readback was not verified.
- The creation request header and creation Alloy payload are unavailable.
- The read-only capture is a sanitized field projection, not a complete HAR.
- The later sampling runtime snapshot is not the historical session snapshot.
- Backend / Alloy / Collector sampling/filtering policies were not inspected.
- The saved creation trace does not contain Credential Management downstream SERVER spans, so the remote service's internal root cause remains unproven.
