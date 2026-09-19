# Jeter frontend → backend trace runtime verification — 2026-09-20

## Verification metadata

- `verified_at`: 2026-09-20 03:40 Asia/Taipei (2026-09-19 19:40 UTC)
- Environment: `tw-stage`; application: Jeter Faro Trace Demo
- Relevant versions: previously verified frontend image `v0.0.4`, backend image `v0.0.9` (2026-09-12). **Current image versions were not rechecked.**
- Raw evidence: [runtime probes](raw/special-lesson-runtime-probes-2026-09-20.json), [authenticated Grafana queries](raw/grafana-runtime-queries-2026-09-20.json), [Browser Network capture](raw/jeter-browser-network-2026-09-20.json), [matching Tempo trace](raw/jeter-tempo-trace-2026-09-20.json)
- Screenshot: [Jeter scenario page, privacy-masked capture](../../assets/special-lesson-evidence/jeter-demo-page-raw.png) and [annotated action](../../assets/special-lesson-evidence/jeter-slow-scenario-annotated.png). The response body region was masked because it contained demo employee names. These show the real Slow button and HTTP 200 page result; the header and span proof are in the raw Network/Tempo projections, not in this screenshot. Actual DevTools/Grafana UI screenshots remain absent.

## Reproduction and observations

1. Read the deployed frontend page and `/config.js` through unauthenticated HTTP GET. Both returned 200. The config body was observed as `BACKEND_URL=https://pek8s-staging.garmin.com/jeter-faro-trace-demo-backend` and `FARO_ENVIRONMENT=tw-stage`; no config body was retained in raw evidence.
2. Sent GET to the demo's `/api/scenario/slow` endpoint. It returned HTTP 200. This is a real deployed demo API response, but it was initiated by PowerShell, **not by the browser application**. No `traceparent` was supplied, no Browser Network row or frontend client span was captured.
3. Unauthenticated Grafana datasource and Tempo proxy GETs returned 401. The learner-supplied `.env` subsequently provided a working stage dashboard token. Its value was never printed or retained.
4. **Before the browser action**, authenticated Tempo `temp123` TraceQL search over the preceding seven days returned two traces for `jeter-faro-trace-demo-backend` and zero for `jeter-faro-trace-demo-frontend` (limit 20). Exact trace lookups succeeded for `40b6756f9c90365547a0b642c77d557f` and `edd5a2b40c655f1879881d419b74568d`. Each contained a backend `GET api/Scenario/slow` server span with **no parentSpanId** and one backend client child span. These are the earlier command-line probes, or at minimum backend-only calls of the same endpoint and time. The zero frontend search result is limited to that earlier query time and is not evidence against the subsequent browser correlation.
5. In the actual Jeter Chrome page, used its mock login with non-personal test name, then clicked the existing Slow scenario. Chrome Network recorded GET `https://pek8s-staging.garmin.com/jeter-faro-trace-demo-backend/api/scenario/slow`, HTTP 200, with `traceparent: 00-6faa6779a2970a3f82ad77e9ab9f4eb7-483e269e249ac6b4-01`.
6. Queried **that exact trace ID** through Grafana's Tempo `temp123` datasource. The returned trace contains Jeter frontend `SPAN_KIND_CLIENT` span `483e269e249ac6b4`, and Jeter backend `SPAN_KIND_SERVER` span `bcaf1c3a1ff7cb07` whose parent is `483e269e249ac6b4`. It also contains a backend child span. Tempo's OTLP JSON expresses span IDs in base64; the comparison above is after decoding to hex.

## Evidence classification

| Layer | Classification | Result |
| --- | --- | --- |
| Faro `backendUrls`, backend OTel, OTLP routing | SOURCE / CONFIG EVIDENCE | Previously verified in [Jeter integration](jeter-integration-and-tracing.md), [trace context](trace-context-propagation.md), and [Collector pipeline](collector-pipeline.md). |
| Deployed Jeter page, runtime config, demo API response | RUNTIME EVIDENCE | 200 responses observed in this pass; demonstrates reachability only. |
| Browser business request and `traceparent` | RUNTIME EVIDENCE | Jeter Slow scenario GET/200; exact header and request ID in Browser Network raw record. |
| Frontend client span and backend server span | RUNTIME EVIDENCE | Both are present in the same exact Tempo trace ID. |
| Backend span in Tempo | RUNTIME EVIDENCE | Two concrete backend-only trace IDs opened through Grafana's Tempo datasource. This proves backend trace storage and query visibility for those records. |
| Browser-to-backend parent/child join | RUNTIME EVIDENCE | Browser header parent ID = frontend client span ID = backend server parent ID. |

**RUNTIME JOIN VERIFIED for this one Jeter Slow scenario.** This does not prove every Jeter endpoint or other frontend application is correlated. The earlier command-line probes remain separate backend-only examples.

## Limitations / next decisive observation

The browser and Tempo data are privacy-reduced projections, not a full HAR or Tempo payload. Specific Alloy/Collector transport for the frontend span was not independently observed in this same capture; its presence in Tempo establishes storage/query visibility. A real DevTools and Grafana UI screenshot is still needed for future learner-facing workflow guidance. Do not retain cookies, authorization headers, or account identity.

## Later UI observation

After learner sign-in, the real Grafana Explore trace query and frontend/backend span tree were captured in [dated Grafana UI evidence](grafana-ui-runtime-2026-09-20.md). This resolves the Grafana UI screenshot gap stated above. A DevTools instructional screenshot remains separate from the CDP Network record.
