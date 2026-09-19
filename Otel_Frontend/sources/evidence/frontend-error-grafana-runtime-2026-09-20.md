# Frontend error → Grafana runtime verification — 2026-09-20

## Verification metadata

- `verified_at`: 2026-09-20 03:40 Asia/Taipei
- Environment: `tw-stage` Foreman page; previously observed Faro receiver resolves to `tw-prod`
- Application: Jeter Faro Trace Demo (controlled stage error); Foreman evidence remains separate.
- Relevant version: previously verified Jeter frontend image `v0.0.4` and app version `1.0.0`; current image version was not rechecked.
- Raw evidence: [Browser error and outbound telemetry](raw/jeter-frontend-error-browser-2026-09-20.json), [matching Loki result](raw/jeter-error-loki-result-2026-09-20.json), plus [earlier Grafana queries](raw/grafana-runtime-queries-2026-09-20.json)
- Screenshot: no retained instructional screenshot from this pass.

## Runtime reproduction and observations

1. Opened the deployed Jeter stage demo in the existing Chrome session and used its mock login with a non-personal test name. In that demo page, scheduled a controlled uncaught `Error` with unique marker `OTEL_FRONTEND_EVIDENCE_20260920_0415`; it changed no business data.
2. Chrome CDP `Runtime.exceptionThrown` observed that marker. `Network.requestWillBeSent` recorded one Faro POST to `https://pek8s-staging.garmin.com/alloy`; `Network.getRequestPostData` showed top-level `meta` and `exceptions`, one `exceptions[]` entry, the exact marker in the POST body, app `jeter-faro-trace-demo-frontend`, environment `tw-stage`. The full body was deliberately not retained because unrelated meta may contain identity/session values.
3. Chrome Network `responseReceived` recorded HTTP **202** for the same request ID `12564.15`. This proves receiver acceptance only.
4. Authenticated Grafana Loki `loki123` query `{service_name="jeter-faro-trace-demo-frontend"} |= "OTEL_FRONTEND_EVIDENCE_20260920_0415"` returned one stored entry. The log's timestamp is `1789848189202029241` Unix nanoseconds. The unique marker and service name pair the Browser error/payload to the Grafana result. The log line itself is not retained because it could carry user metadata.

## Existing evidence reused

- [Foreman Browser Debug Lab](foreman-browser-debug-lab.md) proves a real click payload reached `/alloy` and received 202. This is **click telemetry**, not an error, and does not prove Collector/storage/Grafana visibility.
- [Web Vitals browser evidence](faro-automatic-telemetry-web-vitals-2026-09-18.md) proves automatic measurements and selected receiver outcomes, not frontend error delivery.
- [Alloy/Collector pipeline](collector-pipeline.md) and [Grafana current state](grafana-current-state.md) establish configuration and query surfaces, not delivery of this error.
- The learner-supplied stage Grafana dashboard token worked for authenticated datasource and query API reads. Its value was not retained. Loki `loki123` query `{service_name="foreman-assistant"}` returned zero streams in a bounded preceding 24-hour window (`limit=1`). This is **existing dashboard query behavior** for that window, not proof that no Foreman telemetry exists in any datasource or time range. No frontend error was generated for a matching query.

## Evidence classification

| Layer | Classification | Result |
| --- | --- | --- |
| Controlled frontend error and Console observation | RUNTIME EVIDENCE | Jeter stage demo `Runtime.exceptionThrown` with unique marker. |
| Faro error capture and `/alloy` HTTP outcome | RUNTIME EVIDENCE | Same marker in `exceptions[]` POST body; same request ID returned 202. |
| Alloy → Collector → Loki route | SOURCE / CONFIG EVIDENCE | [Collector pipeline](collector-pipeline.md) records the configured path. Record-specific Collector receive/export metrics were not captured. |
| Loki storage and Grafana query | RUNTIME EVIDENCE | Authenticated Loki datasource query returned one record with the same marker and Jeter frontend service name. |

**FRONTEND ERROR → GRAFANA VERIFIED for this one Jeter stage demo error.** The receiver 202 and the Loki result are separate observations. The precise per-hop Collector processing is inferred from the verified deployed pipeline configuration and final Loki record, not independently established by record-specific Collector metrics.

## Limitations / next decisive observation

The test used a controlled uncaught error in the stage demo because no existing frontend-error button was observed. It is a runtime test of Faro's error capture, not evidence that Jeter's existing scenario buttons throw frontend errors. Capture actual DevTools and Grafana screenshots before turning this into learner-facing UI instructions. The existing Foreman dashboard query returned zero streams for its stated 24-hour window; the correct query for **this Jeter record** is the separate Jeter service/marker query above. No dashboard was changed.

## Later UI observation

After learner sign-in, the actual Grafana Explore Loki query and matching error row were captured in [dated Grafana UI evidence](grafana-ui-runtime-2026-09-20.md). This resolves the Grafana UI screenshot gap stated above. The log row's user/session fields are masked in repository screenshots. A DevTools instructional screenshot remains separate from the CDP Network record.
