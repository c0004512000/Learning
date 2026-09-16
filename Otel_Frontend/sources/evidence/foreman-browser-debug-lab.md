# Foreman Assistant Browser Debug Lab

## Verification metadata

- Verified at: 2026-09-16 10:35 Asia/Taipei
- Browser: Google Chrome 153.0.0.0 (Windows)
- Automation: Playwright Core 1.61.1
- Runtime inspection: Chromium DevTools Protocol (`Runtime`, `DOMDebugger`, `Debugger`, `Network`)
- Page URL: `https://pek8s-staging.garmin.com/foreman-assistant/#/main`
- Page host: `pek8s-staging.garmin.com`
- Safety: account photo / employee identifier were visibly redacted before repository screenshots were captured; raw JSON retains no authentication values

## Claim under test

For one safe, currently visible Foreman Assistant interaction, establish the strongest runtime-supported chain:

    live DOM attribute
      → registered document listener
      → actual ClickInstrumentation execution
      → matching click event in POST /alloy
      → receiver HTTP response

Each boundary is recorded independently. Source expectations are not substituted for runtime observations.

## DOM

- Selected live element: `P-BUTTON[data-link-name="DailySchedule"]`
- Actual `data-link-name`: `DailySchedule`
- Actual inner click target selected by the lab: `SPAN`
- `clickTarget.closest('[data-link-name]')`: the ancestor `P-BUTTON`
- Observed ancestor relationship:

    SPAN
    └─ DIV
       └─ BUTTON
          └─ P-BUTTON[data-link-name="DailySchedule"]

The prior manual clue `EfficiencyAbnormalReport` was rediscovered among current live DOM candidates, but it was not used as the selected click or the correlation value in this run.

Proof scope:

- Proves the deployed live DOM had a tracked value on the target's ancestor path.
- Does not by itself prove listener execution, Faro extraction, an HTTP request, or downstream delivery.

Raw evidence: [`raw/lesson6-dom-runtime.json`](raw/lesson6-dom-runtime.json).

## Listener registration

- `document` click listener count: `1`
- Event type: `click`
- `useCapture`: `false`
- `passive`: `false`
- `once`: `false`
- Handler description: global callback wrapper
- Function location: deployed `polyfills.js`, line 969 (1-based)

The handler location is consistent with a Zone.js wrapper. Registration evidence does not identify the wrapped callback as Faro and does not prove it ran.

Raw evidence: [`raw/lesson6-document-click-listeners.json`](raw/lesson6-document-click-listeners.json).

## Breakpoint / callback execution

- Breakpoint: CDP `DOMDebugger.setEventListenerBreakpoint` for `click`
- Initial pause reason: `EventListener`
- Initial top frame: `globalZoneAwareCallback`
- Initial script URL: `https://pek8s-staging.garmin.com/foreman-assistant/polyfills.js`
- Initial location: line 970 (1-based)
- Zone.js present: yes
- Bounded stepping: 120 `Debugger.stepInto` operations after the `#document` listener pause
- Captured pause snapshots: 125
- Faro callback found: yes

Observed execution path, reduced to the teaching-relevant frames:

    Browser dispatch click
      → globalZoneAwareCallback             polyfills.js:970
      → globalCallback / invokeTask / runTask
      → ClickInstrumentation.handleClick    main.js:131710
      → getTrackedAttributeValue            main.js:131697
      → toPayloadKey                        main.js:131694
      → pushEvent                           main.js:123009

Proof scope:

- Proves the selected click passed through the Zone.js wrapper and entered the deployed Faro `ClickInstrumentation.handleClick`.
- Proves the runtime executed the tracked-attribute extraction helper and reached `pushEvent`.
- Does not prove network creation, receiver acceptance, or any downstream processing. Those require separate Network/downstream evidence.
- Bundle line numbers are evidence locators for this deployment, not stable API contracts.

Raw evidence: [`raw/lesson6-click-breakpoint.json`](raw/lesson6-click-breakpoint.json).

## Network

### Captured request set

With Network cache disabled, the capture observed six `/alloy` requests around the selected click:

| Method | Status | Role established from runtime content |
| --- | ---: | --- |
| POST | 202 | click event |
| OPTIONS | 204 | preflight |
| POST | 202 | `faro.performance.resource` |
| OPTIONS | 204 | preflight |
| POST | 202 | `faro.tracing.xml-http-request` |
| OPTIONS | 204 | preflight |

This request set demonstrates why request order alone cannot identify the click POST.

### OPTIONS / preflight

- Request URL: `https://shixpa-peproxy00.garmin.com/alloy`
- Request method: `OPTIONS`
- Status: `204`
- Request `Origin`: `https://pek8s-staging.garmin.com`
- `Access-Control-Request-Method`: `POST`
- `Access-Control-Request-Headers`: `content-type,x-faro-session-id`
- `Access-Control-Allow-Origin`: `*`
- `Access-Control-Allow-Methods`: `POST`
- `Access-Control-Allow-Headers`: `content-type,x-faro-session-id`
- `Access-Control-Allow-Credentials`: `true`
- Response body: not available

Proof scope:

- Proves the observed preflight received a 204 response that allowed the requested method and headers.
- An unavailable body is compatible with `204 No Content`; it is not failure evidence.
- Does not prove the telemetry POST happened or was accepted.

### Matching POST / telemetry

- Request URL: `https://shixpa-peproxy00.garmin.com/alloy`
- Request method: `POST`
- Status: `202 Accepted`
- Response `Content-Length`: `0`
- Response body: empty
- `events[0].name`: `click`
- `events[0].attributes.link_name`: `DailySchedule`
- `meta.app.name`: `foreman-assistant`
- `meta.app.environment`: `tw-prod`
- `meta.page.url`: Stage Foreman page with the selected system route
- `meta.device.type`: captured in sanitized raw evidence
- `meta.sdk`: `faro-web` `2.9.0`

Correlation:

    live DOM data-link-name = DailySchedule
      = POST click attributes.link_name = DailySchedule

This equality, together with `events[0].name = click`, identifies the matching POST by payload content rather than by timing or order.

Proof scope:

- Proves the matching click payload was sent to the observed receiver URL and that its HTTP boundary returned 202.
- `202 Accepted` does not prove successful Alloy downstream processing, Collector handling, OpenSearch ingestion, or Grafana queryability.

Raw evidence: [`raw/lesson6-alloy-network.json`](raw/lesson6-alloy-network.json).

## Environment observation

### Observed runtime fact

- Page host: `pek8s-staging.garmin.com`
- `/alloy` request URL: `https://shixpa-peproxy00.garmin.com/alloy`
- Payload `meta.app.environment`: `tw-prod`

### Expected from source/config

[`foreman-integration.md`](foreman-integration.md) records that the verified Foreman source passes `environment: 'tw-prod'`. [`browser-to-alloy.md`](browser-to-alloy.md) records that the package resolver maps `tw-prod` to the observed receiver URL.

### Intended design

Unknown. No deployment requirement or environment policy was inspected in this lab that establishes which Faro environment Stage Foreman is intended to use.

### Bug conclusion

Unknown. The runtime/source agreement is an observed fact, not sufficient evidence to label the configuration a bug.

## Screenshot inventory

All screenshots under [`../../assets/lesson-6/`](../../assets/lesson-6/):

1. `01-foreman-main-runtime.png` — real page screenshot; personal account region visibly redacted.
2. `02-live-dom-click-target.png` — real page screenshot with Playwright-added yellow highlight; personal account region visibly redacted.
3. `03-document-click-listener.png` — rendered from captured CDP listener evidence.
4. `04-click-breakpoint-callstack.png` — rendered from captured CDP pause/step evidence.
5. `05-network-alloy-list.png` — rendered from captured CDP Network evidence.
6. `06-alloy-preflight-headers.png` — rendered from captured CDP OPTIONS evidence.
7. `07-alloy-click-post-payload.png` — rendered from captured CDP POST payload evidence.
8. `08-alloy-post-response.png` — rendered from captured CDP response evidence.

The rendered cards are not Chrome DevTools screenshots and are labeled accordingly in both the images and Lesson 6 captions.

## Unknown / not proven

- Initial capture did not include Chrome DevTools UI or Network duration. These gaps are addressed by the separate UI supplement below; do not merge the two request sets.
- Intended policy for Stage UI using `tw-prod`: unknown.
- Successful processing after the receiver HTTP boundary: not proven.
- Collector receipt/export, OpenSearch document creation, and Grafana visibility: not tested in this Browser-only lab.
- Learner mastery: not inferred from artifact creation or lab execution.

## Actual DevTools UI supplement — 2026-09-16

- Verified at: projected NetworkLog export `2026-09-16T10:05:51.278Z` (18:05:51 Asia/Taipei); screenshots around 18:00–18:06.
- Browser: existing Chrome 153, controlled with standalone Playwright Core following explicit learner authorization. No browser executable was downloaded or installed.
- Authentication: user manually completed login; the same Playwright Browser context was retained for all UI captures.
- Genuine frontend: Chrome's built-in `devtools://devtools/bundled/devtools_app.html`, connected to the Stage target over local CDP. These are actual frontend screenshots, not rendered cards or a reconstructed DevTools page.
- Stage live DOM independently confirmed 29 tracking elements; selected attribute value again `DailySchedule`.
- Console's actual `getEventListeners(document).click` projection showed one click listener, all three flags false, function name `globalZoneAwareCallback`.
- Event listener breakpoint settings were captured with only Mouse → click checked. Playwright-injected listener and source-map/ignore-list behavior affected first visible pauses; arbitrary event-listener pauses must not be attributed to Faro.
- The loaded runtime `main.js` was inspected to locate `this.handleClick`; a line breakpoint at bundle line 131710 actually paused inside `ClickInstrumentation.handleClick`. The frontend mapped it to `clickInstrumentation.js:29`; Call Stack showed Zone.js invokeTask/runTask/globalCallback/globalZoneAwareCallback. The pause reason for this image is `other`, not the initial lab's `EventListener`.
- The code visible beside a paused frame is source context. The screenshot proves callback entry, but does not independently prove every visible line executed. Initial bounded-stepping JSON remains the evidence for extraction and pushEvent execution.
- Network captured 13 `/alloy` rows in this supplement, including OPTIONS 204 and POST 202. Method and Waterfall columns were enabled in the actual frontend. Time values were observable (approximately 10–74 ms in the list); these are not the initial six-request capture.
- Matching POST was selected by payload, not order: `events[0].name=click`, `events[0].attributes.link_name=DailySchedule`; `events[1]` was a resource event. Environment remained `tw-prod`, receiver remained `https://shixpa-peproxy00.garmin.com/alloy`.
- OPTIONS Response actually displayed “Failed to load response data / No content available for preflight request”; General for that request was 204. POST Response displayed an empty editor; its General was 202 with response Content-Length 0.
- Privacy: user/session metadata and trace payloads are omitted or redacted in the new whitelisted JSON projection. Actual POST header screenshot replaces the session header value with `[REDACTED]`; no authentication values are retained. Screenshots were visually reviewed. Scope objects containing possible personal values were not expanded.

### New actual UI screenshots

9. `09-devtools-elements-ui.png` — Elements tab, tracked host, DOM tree, Styles, breadcrumb.
10. `10-devtools-console-listener-ui.png` — Console query and seven-field reading bridge.
11. `11-devtools-click-breakpoint-setup-ui.png` — Sources event listener breakpoint click checkbox; visible VM script is Playwright instrumentation, not Faro evidence.
12. `12-devtools-faro-paused-ui.png` — actual callback line breakpoint, source-mapped source and Zone.js Call Stack.
13. `13-devtools-network-list-ui.png` — real Method/Status/Type/Initiator/Size/Time/Waterfall table.
14. `14-devtools-preflight-headers-ui.png` — actual OPTIONS General and CORS request/response headers.
15. `15-devtools-click-payload-ui.png` — events → click → attributes.link_name, plus separate resource event.
16. `16-devtools-post-status-ui.png` — matching POST 202 and response length 0; session header value redacted.
17. `17-devtools-post-response-ui.png` — same matching POST empty body.
18. `18-devtools-preflight-response-ui.png` — unavailable preflight body, not HTTP failure evidence.

All new images are placed beside their relevant Lesson 6 steps; four workspace examples are also embedded in [Reference 0005](../../reference/0005-devtools-workspaces-for-faro.html). Each caption explains location, reading focus, proof scope and limits.

New durable projections: [Network](raw/lesson6-devtools-ui-network.json), [paused call frames](raw/lesson6-devtools-ui-pause.json). These are privacy-reduced exports of CDP-backed frontend runtime data, not full HAR or Scope dumps. Request identifiers, authentication headers, trace payloads and personal metadata are intentionally not retained. Script URL was not captured in the new pause export and is explicitly marked there.

Remaining unknowns: intended environment policy/bug conclusion and all downstream processing after receiver HTTP acceptance. No learner mastery claim follows from these artifacts.
