# Learning Record 0012 — Browser trace, transport, and persistence boundaries

Date: 2026-10-05

## Learner-state evidence

After successfully integrating Faro into IDP Portal, a real Keychain investigation exposed several boundaries that were individually present in the course but not yet strong enough as one operational mental model:

- a business request, a Faro telemetry item, a Faro upload batch, receiver acceptance, and storage persistence are different stages;
- `traceparent` carries trace identity and caller context, while its `01` sampled bit is not a storage acknowledgement;
- a completed sampled span can spend time in OTel/Faro in-memory batching before a Network POST exists;
- the Faro transport URL is deliberately excluded from frontend HTTP tracing, so repeated `/alloy` rows are not sufficient evidence of a self-tracing loop;
- query identity can hide valid telemetry even when ingestion succeeded;
- exact Browser-header correlation and time/URL/service-based correlation have different evidentiary strength.

The most pedagogically useful runtime proof is a read-only IDP Portal request whose Browser `traceparent`, Faro upload span, Tempo frontend span, and backend parent ID all match exactly.

## Teaching correction

Teach one explicit sequence of claims:

```text
business request exists
  -> trace context is propagated
  -> frontend span is completed / sampled
  -> span enters in-memory batching
  -> Faro transport attempts POST /alloy
  -> receiver returns HTTP status
  -> downstream pipeline processes the signal
  -> storage persists it
  -> query selects the correct identity/time/labels
```

Evidence at one step must not be used as proof of every later step.

In particular:

```text
traceparent ...-01
  != "Tempo has it"

POST /alloy -> 202
  != "Collector and storage are done"

span in BatchSpanProcessor
  != "Network upload happened"

Tempo query returns 0
  != "telemetry never existed"
```

## Durable teaching constraints

- Start Browser trace verification from the **business request**, not from `/alloy`.
- Prefer exact `traceparent` trace ID correlation when it is available.
- If the original header is unavailable, allow time + URL + method + service search only as weaker evidence and label it accordingly.
- Treat `parent-id` as the caller/current operation ID; the backend creates its own new span ID and records the caller as parent.
- Treat `01` as sampled context only; storage needs independent persistence evidence.
- Teach batching as an in-memory pre-delivery stage. Do not equate buffer insertion, exporter success, HTTP acceptance, and persistence.
- Do not infer one business request ↔ one `/alloy` request. Inspect payload signal content.
- Explain that the transport receiver URL is excluded from Browser HTTP tracing in the verified Faro implementation; multiple transport requests alone do not prove a recursive loop.
- When telemetry appears missing, verify the query identity and filters before concluding generation/ingestion failed.
- Preserve the evidence-strength distinction between exact Browser header → Tempo ID equality and correlation reconstructed from surrounding evidence.
- Do not diagnose a downstream service's internal root cause from a long caller CLIENT span when the downstream SERVER/internal spans are absent.

## Artifact implications

- Durable evidence: [`sources/evidence/idp-portal-keychain-runtime-2026-10-05.md`](../sources/evidence/idp-portal-keychain-runtime-2026-10-05.md).
- Add the IDP Portal runtime case as durable evidence, not as a Keychain-specific main-path Lesson.
- Refine Lessons 5–9 with only the reusable boundaries above.
- Keep the W3C `traceparent` reference explicit that sampled flag is not persistence.
- Extend the planned production troubleshooting material with query identity / dashboard-filter mismatch as a separate fault domain.
- Do not advance learner progress; these findings came from guided incident work and evidence collection, not retrieval/mastery of the main course Lessons.

## Progress

Main course progress remains at Milestone 2 / Lesson 3. This record changes future teaching constraints and evidence quality, not mastery state.
