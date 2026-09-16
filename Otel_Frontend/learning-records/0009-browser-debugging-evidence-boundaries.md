# Learning Record 0009 — Browser debugging evidence boundaries

Date: 2026-09-16

## Why this record exists

Lesson 6 previously explained DevTools concepts mostly through prose and earlier manual observations. A real Foreman Assistant Stage lab using Playwright plus Chromium DevTools Protocol has now established durable runtime evidence for DOM, listener registration, callback execution, CORS preflight, telemetry payload correlation, and the receiver HTTP response.

This updates the teaching basis. It does **not** show that the learner has completed or mastered Lesson 6.

## Runtime-backed teaching constraints

Future Browser debugging lessons should preserve this reasoning sequence:

    claim
      → Browser responsibility boundary
      → evidence type
      → DevTools panel / CDP domain
      → proof limit

The tool panel is chosen after the claim, not before it.

## Evidence distinctions now grounded in a real runtime

1. **Live DOM vs source expectation**
   - This run discovered current `[data-link-name]` elements at runtime.
   - The selected value was `DailySchedule`; it was not copied from source or the earlier `EfficiencyAbnormalReport` clue.
   - The inner click target was `SPAN`, while the tracked attribute was on ancestor `P-BUTTON`.

2. **Listener registration vs callback execution**
   - `DOMDebugger.getEventListeners` found one non-capture document click listener through a Zone.js wrapper.
   - Registration alone was not treated as Faro execution.
   - A click event breakpoint plus bounded stepping reached `ClickInstrumentation.handleClick`, `getTrackedAttributeValue`, `toPayloadKey`, and `pushEvent`.

3. **Network row vs telemetry identity**
   - The operation produced click, resource-performance, and tracing POSTs, plus OPTIONS preflights.
   - Request order, status, and initiator cannot identify the click.
   - The click POST was correlated by equality between the live DOM `data-link-name` and payload `attributes.link_name`.

4. **OPTIONS vs POST**
   - OPTIONS answered the CORS permission question through headers and `204 No Content`.
   - POST carried telemetry content and returned `202 Accepted`.
   - An unavailable preflight body and an empty POST response body were interpreted using status and headers, not treated as failures by themselves.

5. **HTTP acceptance vs downstream success**
   - The matching `202` closes the Browser → receiver HTTP boundary for this request.
   - Alloy downstream processing, Collector, OpenSearch, and Grafana remain unproven.

6. **Observation vs bug conclusion**
   - Stage Foreman sent `meta.app.environment = tw-prod` to the prod receiver.
   - Runtime and the verified source/config expectation agree.
   - Intended deployment policy was not verified, so the bug conclusion remains Unknown.

## Presentation constraint

When the environment cannot reliably capture real Chrome DevTools UI:

- retain sanitized CDP raw output;
- present any learner-facing summary only from captured values, using shared-style HTML;
- label it as a summary of captured CDP runtime evidence;
- never present the visualization as an original DevTools screenshot;
- pair every figure with “what to inspect / what it proves / what it cannot prove.”

## Current ZPD

The evidence and revised Lesson now provide a stronger practice environment, but no retrieval or hands-on learner performance was observed in this maintenance task. Do not advance progress or mark Lesson 6 mastered.

Future retrieval should ask the learner to choose the correct evidence for a claim and state its proof limit, especially:

- registration vs execution;
- OPTIONS vs POST;
- request identity by payload rather than order;
- `202 Accepted` vs downstream ingestion;
- observed fact vs intended design vs bug conclusion.
