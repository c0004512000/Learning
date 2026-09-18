# Faro automatic telemetry / Web Vitals evidence

## Scope and status

- Review date: 2026-09-18, Asia/Taipei. **Historical runtime reinspection, not a new browser capture.**
- Runtime source: [Lesson 6 original capture](raw/lesson6-alloy-network.json), `verifiedAt = 2026-09-16T02:35:14.329Z`.
- Browser: Chrome 153 on Windows; SDK: `meta.sdk.name = faro-web`, version `2.9.0`.
- Page: Foreman Assistant Stage. App `foreman-assistant`, version `1.0.15-dev`, declared telemetry environment `tw-prod`.
- Request locator: `requests[2]`, request ID `2928.35`; POST `https://shixpa-peproxy00.garmin.com/alloy`, HTTP 202. Locate by ID rather than assuming this index in another capture.
- Exact bounded projection: [web-vitals-lcp-observed.json](raw/web-vitals-lcp-observed.json). It omits meta/person identifiers and unrelated resource-event details. No metric values were invented.

## Observed structure

The HTTP body (`postData` in the capture wrapper) contains both `events` and `measurements`. `measurements[0]` contains:

| Path | Observed value |
| --- | --- |
| `type` | `web-vitals` |
| `values.lcp` | `3156` |
| `values.delta` | `3156` |
| `values.element_render_delay` | `3025.100000000093` |
| `values.time_to_first_byte` | `130.89999999990687` |
| `timestamp` | `2026-09-16T02:35:05.377Z` |
| `context.id` | `v5-1789526101479-4606450969808` |
| `context.rating` | `needs-improvement` |
| `context.navigation_type` | `navigate` |
| `context.navigation_entry_id` | `qneYAM8qtW` |
| `context.element` | `#lesson6-runtime-redaction` |

The selector identifies a capture-added redaction element. The measurement is evidence of emitted Web Vitals telemetry, **not representative product LCP performance**. Do not use 3156 ms or the rating as a Foreman performance assessment. The ID is a metric ID, not a user/session ID. `navigation_entry_id` matches the resource event's `faroNavigationId` in the same body; this is navigation context, not a business subsystem name.

No `inp`, `cls`, `input_delay`, `processing_duration`, or `presentation_delay` appears in the inspected saved runtime captures. No new INP/CLS value or screenshot can be claimed.

## Version-specific implementation evidence

Read the upstream files at **v2.9.0**, matching the observed SDK version, on 2026-09-18:

1. [getWebInstrumentations.ts](https://github.com/grafana/faro-web-sdk/blob/v2.9.0/packages/web-sdk/src/config/getWebInstrumentations.ts): default list includes `WebVitalsInstrumentation`.
2. [instrumentation.ts](https://github.com/grafana/faro-web-sdk/blob/v2.9.0/packages/web-sdk/src/instrumentations/webVitals/instrumentation.ts): initialization passes the measurement API to the Web Vitals implementation.
3. [webVitalsWithAttribution.ts](https://github.com/grafana/faro-web-sdk/blob/v2.9.0/packages/web-sdk/src/instrumentations/webVitals/webVitalsWithAttribution.ts): registers browser-derived metric callbacks and produces Web Vitals measurement values/context. INP attribution includes the three constituent timings; CLS has shift attribution. `reportAllChanges` is configuration-dependent. Optional attributes are added with a truthiness guard: zero can be omitted; a missing constituent is not proof that phase did not happen.
4. [measurements/initialize.ts](https://github.com/grafana/faro-web-sdk/blob/v2.9.0/packages/core/src/api/measurements/initialize.ts): adds timestamp and context to measurement payload; transports execute after optional user-action buffering/dedupe.

The automatic path is browser performance observations → Web Vitals callbacks → measurement API → transport. This establishes that Faro **can automatically produce and send** these measurements when the instrumentation is enabled and lifecycle/browser conditions are met. The historical runtime confirms a Web Vitals measurement was actually transmitted. A payload type string alone does not prove the call origin: applications can manually call `pushMeasurement` with the same type. We have not captured the deployed Web Vitals callback stack in this run. Private package source re-fetch returned 404; existing [package evidence](faro-click-tracking.md) and learner-designated [developer material](../materials/3.%20Faro-Click-Tracking%20Introduction%20(for%20developer).html) supply the local integration context, not new source verification.

## Browser documentation and purpose

- [INP](https://web.dev/articles/inp): interaction-to-next-paint meaning; input waiting, event-handler processing, and presentation phases; no INP without a qualifying interaction. Used only to explain cause and measurement conditions.
- [CLS](https://web.dev/articles/cls): visual instability and unitless score. Used to distinguish layout movement from time latency.
- [LCP](https://web.dev/articles/lcp): largest visible content rendering milestone. Used to interpret the observed `lcp` unit, not to grade this app.
- [Chrome Network payload](https://developer.chrome.com/docs/devtools/network/reference#payload): request-detail workflow; Payload is request content, Response is receiver content.

## Screenshot provenance and remaining capture contract

The Reference reuses four genuine Lesson 6 PNGs: page, Network list, POST Headers, and click Payload. Their existing capture dates/passes remain intact; the afternoon UI pass has 13 rows and is **not the same request set** as the morning six-request raw capture. Red rectangles are SVG overlays in the HTML. These images teach UI locations only and do not show Web Vitals payload evidence.

Browser and Computer Use skills were read. The required `node_repl js` tool and tool discovery are absent from the session tool inventory. No browser connection, new screenshot, Docker browser, or Windows executable installation was attempted. An isolated Docker browser would not reproduce this authenticated Foreman session; no alternate browser mechanism was used to bypass the prescribed control surface.

Before marking the PR ready, capture a new complete UI pass:

1. Page and DevTools Network recording/filter state before reload.
2. `/alloy` list and a selected POST's URL/method/status.
3. Payload → expanded `measurements` → measurement index → `type`.
4. Real INP values plus input/processing/presentation timings; same measurement context including rating/navigation type and attribution where present.
5. Real CLS values/context; LCP if observed. Preserve original numeric values and note absent/zero fields.
6. Record reload, safe interaction, hide/show lifecycle, actual SDK version and request correlation. Observe automatic measurements without manually pushing them; inspect loaded initialization/callback source if attribution proof is needed.
7. Redact only sensitive values in the captured pixels; avoid adding page DOM overlays before performance measurement, because the prior redaction element affected LCP.
8. Inspect red rectangles at full size. Test Reference and round-trip links at desktop/mobile viewports; confirm no page-level horizontal overflow.

## Course relevance

Reference 0007 is the next available Reference number; Lesson 0007 is a separate namespace. This is a reusable payload lookup and DevTools verification aid for Lessons 5/6. It adds no main-path milestone, learner completion, or mastery claim. Full Lighthouse/CrUX/SEO coverage is outside scope.
