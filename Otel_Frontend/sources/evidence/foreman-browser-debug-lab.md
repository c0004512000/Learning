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

- Actual Chrome DevTools UI screenshots: not captured. The environment reliably exposed CDP output, so learner-facing visualizations were rendered from that evidence instead.
- Exact Network `Time` duration: not captured in the durable raw evidence.
- Intended policy for Stage UI using `tw-prod`: unknown.
- Successful processing after the receiver HTTP boundary: not proven.
- Collector receipt/export, OpenSearch document creation, and Grafana visibility: not tested in this Browser-only lab.
- Learner mastery: not inferred from artifact creation or lab execution.
