# Learning Record 0011 — Trace vs Browser resource performance debugging boundary

Date: 2026-09-21

## Learner-state evidence

A concrete Jeter runtime investigation exposed a missing mental-model boundary in the current lessons:

- one business API request can produce both `faro.tracing.fetch` / span telemetry and a separate `faro.performance.resource` event;
- those records can be transported in separate `/alloy` POSTs without implying that the business API ran twice;
- the current stage pipeline stores the resource performance event in Loki as an OTLP log record, while tracing spans are queried through Tempo.

The learner correctly challenged an over-broad debugging rule that said a slow API should be investigated by looking at `faro.performance.resource` first.

## Teaching correction

Do not teach a fixed ordering of "API slow -> performance event first".

Use the responsibility boundary instead:

```text
Trace / Tempo
  -> locate latency inside the distributed operation
  -> frontend / backend / DB / downstream spans

faro.performance.resource / Loki
  -> inspect Browser-side HTTP experience
  -> URL / status / duration / TTFB / transfer / cache context
```

When a complete trace exists, trace timing is the stronger evidence for locating the slow operation. Resource performance is complementary Browser evidence and can still provide useful facts when the matching trace is unavailable, including sampling/retention gaps.

## Durable teaching constraints

- Do not equate one user action, one business request, one Faro telemetry item, and one `/alloy` HTTP request.
- When multiple `/alloy` POSTs appear, inspect payload content before calling them duplicates.
- Keep `faro.performance.resource` classified as a Faro event in the Browser payload; do not call it a span unless separate trace evidence proves a span.
- Teach only the Browser performance fields that materially help the Mission: resource URL, status, duration, TTFB, response time, transfer size, cache classification, and initiator type.
- Do not expand the course into a complete Resource Timing / Browser networking curriculum. DNS/TCP/TLS sub-timings are local deep-dive material only when the active incident reaches that fault domain.
- Preserve the distinction between root-cause localization and Browser-experience evidence in the future Faro automation Skill.

## Artifact implications

- Lesson 5 should make the transport-unit vs telemetry-unit boundary concrete with the Jeter two-payload example.
- Lesson 6 should teach how to classify multiple `/alloy` POSTs by Method and Payload instead of request count/order.
- Lesson 7 should add only the minimal boundary between tracing telemetry and Browser performance events; its main propagation scope remains unchanged.
- Lesson 9 should later consume the verified `faro.performance.resource -> OTLP log -> Loki` pipeline as a concrete signal-conversion example.

## Progress

This interaction is a teaching correction and runtime-evidence clarification. It does not by itself demonstrate retrieval/mastery of Lessons 5–7 and must not advance the main course position.
