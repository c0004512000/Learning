# Faro automatic telemetry / Web Vitals evidence

## Verification metadata

- Verified: 2026-09-18, Asia/Taipei. New authenticated browser capture, separate from Lesson 6's historical evidence.
- Tools: existing Playwright Core 1.61.1 and existing Chrome 153 on Windows; no executable download/installation.
- Page: `https://pek8s-staging.garmin.com/foreman-assistant/#/main`; learner manually logged in. No credentials/authentication storage inspected or exported.
- Observed SDK: `faro-web` `2.9.0`; app `foreman-assistant` `1.0.15-dev`; telemetry environment `tw-prod`.
- Receiver: `https://shixpa-peproxy00.garmin.com/alloy`. Stage page / tw-prod receiver is an observation, not a bug conclusion without deployment requirements.
- [Primary Network capture](raw/web-vitals-main-network-2026-09-18.json): actual built-in Chrome DevTools NetworkLog records inspected through Playwright/CDP. Measurement values/context unchanged; personal meta, header values and unrelated event attributes omitted.

## Main capture procedure and conditions

1. After login: Network recording on, Keep log on, `alloy` filter, Method column, Clear. Screenshot 01 has an empty table; the summary counter was still refreshing and is not the capture's request count.
2. Reload main at approximately 18:34:21. Screenshot 02 shows the real app. Mask account splitbutton in screenshot pixels only; no DOM redaction overlay.
3. At approximately 18:34:45, click the visible hamburger/menu button. No `data-link-name` ancestor was found on this button. Screenshot 03 shows the sidebar. Close using the sidebar's own close button at approximately 18:37:43. No business form submitted.
4. Attempted window/tab switches did not generate visibility changes. Playwright 1.61.1's installed implementation (`lib/coreBundle.js` focus override near line 37054) enables focus emulation. A temporary read-only diagnostic listener observed no visibility changes and a trusted sidebar-close click; it called no Faro API and was discarded on reload. Do not describe those attempted switches as proven hidden transitions.
5. Reload to obtain actual automatic lifecycle reporting; Preserve log retains the request bodies. Screenshots 04–12 show the primary NetworkLog set: 24 alloy-filtered rows, 57 unfiltered requests at screenshot time. No replacement UI or fabricated fields.
6. Capture numeric evidence before any debugger proof. Initial login observations and old-document finalization at the first reload are distinguishable by metric/navigation IDs and timestamp. `navigation_type=reload` alone cannot identify a document.

## Actual measurements and HTTP outcomes

| Request | Observed values | Outcome |
| --- | --- | --- |
| `54748.138` | TTFB `27.400000005960464`; FCP `248` | 202 |
| `54748.143` | LCP `268`; delta `268`; element_render_delay `240.59999999403954`; time_to_first_byte `27.400000005960464` | 202 |
| `54748.145` | INP `64` and CLS `0.0020346900720164605` in one measurements array | failed/canceled; no HTTP acceptance proof |
| `54748.146` | Same INP/CLS IDs and timestamps | no recorded HTTP status; no acceptance proof |

Do not count matching bodies as separate interactions, infer a retry/dedupe cause, or claim all requests were accepted because other rows are 202. Cause of cancellation/unknown delivery was not investigated. These bodies prove outbound measurement generation/request creation; acceptance and downstream storage are separate boundaries.

### INP: request 54748.145 / measurements[0]

- `type=web-vitals`, `inp=64`, `delta=64`.
- `input_delay=1.800000011920929`, `processing_duration=2.300000011920929`, `presentation_delay=59.89999997615814`.
- `interaction_time=24321.5`, `next_paint_time=24385.5`.
- `timestamp=2026-09-18T10:37:43.423Z`.
- Context: `rating=good`, `navigation_type=reload`, `navigation_entry_id=S6kEiCtJ9d`, `load_state=complete`, `interaction_type=pointer`.
- Target ends in `span.p-button-icon.pi.pi-bars`, identifying the menu-opening interaction, not the later close click. INP need not correspond to the last click.
- Metric ID `v5-1789727660937-2123246053692`; metric identity is not user identity.
- Durations sum to 64 ms; teaching display rounds to 1.8 + 2.3 + 59.9 ≈ 64. Timeline offsets are not additional durations.

### CLS: same request / measurements[1]

- `cls=0.0020346900720164605`, same delta.
- `largest_shift_value=0.0015081661522633745`, `largest_shift_time=248.40000000596046`.
- Same timestamp, rating/navigation type/navigation entry/load state; distinct metric ID `v5-1789727661087-8462307728656`.
- `largest_shift_target` is the toolbar flex container. CLS is unitless; largest individual shift is not the overall score. This attribution alone does not tie the shift to the menu click.

### LCP: request 54748.143 / measurements[0]

- Timestamp `2026-09-18T10:34:45.222Z`; `rating=good`, `navigation_type=reload`, navigation ID `S6kEiCtJ9d`.
- Metric ID `v5-1789727660937-4649186803274`; element is toolbar `h1.text-white`, a genuine app element.
- One controlled desktop observation is not a representative production percentile or proof all app resources/transactions completed.

## Automatic origin: deployed source and actual callback

[Deployed source locations](raw/web-vitals-deployed-source-locations-2026-09-18.json) and [callback-origin raw capture](raw/web-vitals-callback-origin-2026-09-18.json) identify loaded `main.js`, SHA-256 `5a0832a60f97cc7fa41fdf39be3722153758c613684c4673ea68ab2b3f09d18c`.

- Default list includes WebVitalsInstrumentation at line 126447; initialization constructs WebVitalsWithAttribution at line 125425.
- INP/CLS/LCP/TTFB method locations: 125311 / 125273 / 125339 / 125361.
- **Separate origin pass** at approximately 18:43:41: actual pause at `pushMeasurement`, main.js:125402, called from `V.reportAllChanges._a`, main.js:125378, inside the TTFB registration/callback. Captured metric arguments contain TTFB and Web Vitals context; subsequent frames lead through library timing callbacks and Zone.js timer execution.
- This proves an enabled automatic Web Vitals callback reached the measurement API. It is not the same stack as primary INP 64 ms. Breakpoint timings are not included as primary performance evidence.
- Breakpoint removed, debugger disabled and execution resumed. Only Web Vitals metric arguments/function locations retained, no general scope or personal identity dump.
- Automation never manually called pushMeasurement, pushEvent or other Faro APIs. SDK instrumentation produced the metrics.

Type alone is weaker evidence: an app could manually choose the same type string. Combined evidence separates mechanism, actual automatic execution, outbound bodies, and HTTP acceptance.

## Version-matched official sources and purpose

Read on 2026-09-18, pinned to v2.9.0 to match observed SDK:

- [getWebInstrumentations.ts](https://github.com/grafana/faro-web-sdk/blob/v2.9.0/packages/web-sdk/src/config/getWebInstrumentations.ts): default Web Vitals inclusion.
- [instrumentation.ts](https://github.com/grafana/faro-web-sdk/blob/v2.9.0/packages/web-sdk/src/instrumentations/webVitals/instrumentation.ts): initialization.
- [webVitalsWithAttribution.ts](https://github.com/grafana/faro-web-sdk/blob/v2.9.0/packages/web-sdk/src/instrumentations/webVitals/webVitalsWithAttribution.ts): field mapping, callbacks, reportAllChanges; optional attribution uses truthiness guard, so zero can be omitted.
- [measurements API](https://github.com/grafana/faro-web-sdk/blob/v2.9.0/packages/core/src/api/measurements/initialize.ts): context/timestamp, buffering/dedupe, dispatch.
- [INP](https://web.dev/articles/inp): interaction-to-next-paint phases, qualifying interactions and report timing.
- [CLS](https://web.dev/articles/cls): visual stability and unitless score.
- [LCP](https://web.dev/articles/lcp): largest visible content rendering milestone.
- [Chrome Network Payload](https://developer.chrome.com/docs/devtools/network/reference#payload): actual UI flow and Payload versus Response.

Official docs support definitions/conditions, not Foreman numbers. Local business boundary uses [existing package evidence](faro-click-tracking.md), [host integration](foreman-integration.md), and learner-designated developer material. Private package source re-fetch returned 404; do not present it as newly reverified. Browser metrics do not supply business link names, subsystem meanings or authenticated app user identity.

## Screenshot provenance and red rectangles

Twelve genuine PNGs under `assets/reference-7/`: 01 recording ready; 02 main page; 03 sidebar interaction; 04 alloy list; 05 Payload/measurements; 06 two indexes; 07 type; 08 INP constituents; 09 INP context; 10 CLS; 11 LCP; 12 same LCP's POST/202 Headers.

02/03 account identity is masked in screenshot pixels. Header values remain collapsed in 12; meta user/session never expanded in payload images. SVG red rectangles use existing evidence-annotations.css, with positions derived from inspected PNG pixels. They emphasize fields and UI locations, not decoration. Original screenshot pixels remain intact except explicit account masking; rectangles are teaching overlays, not native DevTools UI.

## Historical evidence and course relevance

[Historical projection](raw/web-vitals-lcp-observed.json) retains 2026-09-16 request 2928.35, LCP 3156 / needs-improvement / element #lesson6-runtime-redaction. That page DOM mask affected the measurement. Historical structure evidence is not product performance and is not merged with the new UI pass.

Reference 0007 is the next available Reference number, separate from Lesson numbering. It is a reusable payload/DevTools aid for Lessons 5/6, with minimal round-trip links; no new main milestone, completion or mastery claim. Lighthouse/CrUX/SEO are outside scope.

Local desktop/mobile QA is recorded in [QA raw record](raw/web-vitals-reference-qa-2026-09-18.json). Deployed GitHub Pages QA is distinct; branch artifact is not claimed production-ready.
