# Trace Context and Faro web tracing — external source pointers

Verified: 2026-09-17

These pointers are supplementary authoritative sources used to verify the tracing behavior required by Lesson 7. They do not replace the learner-designated primary corpus.

## W3C Trace Context

- W3C Recommendation: https://www.w3.org/TR/trace-context-1/
- Relevant sections:
  - §2.1–2.3: why distributed trace context must cross component boundaries
  - §3.2: `traceparent` format
  - §3.2.2.3: `trace-id`
  - §3.2.2.4: `parent-id`
  - §4.2–4.3: processing with or without an incoming `traceparent`

Verified teaching facts:

- `traceparent` carries four fields: `version-trace-id-parent-id-trace-flags`.
- For version `00`, `trace-id` is 32 lowercase hex characters and identifies the whole distributed trace.
- `parent-id` is 16 lowercase hex characters representing the caller's current operation/request identifier; in tracing systems this is commonly a span ID.
- When a valid `traceparent` is received, the receiving tracing system can continue the same trace context; when none is received, a new trace context is created.
- For an outgoing request, a participating tracing system updates `parent-id` to represent its current operation.

## Grafana Faro Web SDK v2.9.0

- `TracingInstrumentation` implementation:
  https://github.com/grafana/faro-web-sdk/blob/v2.9.0/packages/web-tracing/src/instrumentation.ts
- Default Fetch/XHR instrumentation construction:
  https://github.com/grafana/faro-web-sdk/blob/v2.9.0/packages/web-tracing/src/getDefaultOTELInstrumentations.ts

Verified teaching facts:

- `TracingInstrumentation` registers a `W3CTraceContextPropagator` by default unless a custom propagator is supplied.
- It reads `propagateTraceHeaderCorsUrls` from tracing instrumentation options.
- That option is passed into the default Fetch and XHR instrumentations.
- The default browser tracing path therefore has distinct responsibilities: HTTP instrumentation creates/observes request spans, the W3C propagator serializes trace context, and configured URL matching controls where cross-origin trace headers may be propagated.

## Relationship to internal package evidence

The internal `@sre2/faro-click-tracking` evidence records that its public `backendUrls` option is passed to Faro `TracingInstrumentation` as `propagateTraceHeaderCorsUrls`. This means `backendUrls` describes business/backend API URL targets eligible for trace-context propagation; it is not the Faro/Alloy telemetry receiver URL.
