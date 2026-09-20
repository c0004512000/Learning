# Special Lesson visual runtime evidence — 2026-09-20

## Provenance

- `verified_at`: 2026-09-20 22:14 Asia/Taipei
- Environment: `tw-stage`
- Application: Jeter Faro Trace Demo
- Raw projection: [special-lesson-visual-runtime-2026-09-20.json](raw/special-lesson-visual-runtime-2026-09-20.json)
- Current runtime differs from previous verified state: this capture uses trace `e0a53e…` and marker `OTEL_VISUAL_CHECK_20260920_B`; earlier dated trace and error records remain unchanged.
- All repository screenshots are cropped, privacy-reviewed, and paired with their annotated teaching overlay. The red rectangle is not native UI.

## Trace walkthrough evidence

The authenticated browser session clicked the deployed Jeter Slow scenario. The real DevTools Network UI shows the `slow` business request and its request header. The captured header was:

```text
00-e0a53e388efd225f43fb08e7fd68aa23-10dc5dfab188fdc0-01
```

The browser request returned HTTP 200. The same trace ID was opened in the authenticated Grafana Tempo UI. Tempo displayed three spans: a Jeter frontend client span, a Jeter backend server span, and a backend child span. The authenticated Tempo runtime API projection records:

| service | kind | span ID | parent span ID |
| --- | --- | --- | --- |
| `jeter-faro-trace-demo-frontend` | client | `10dc5dfab188fdc0` | none |
| `jeter-faro-trace-demo-backend` | server | `ceb5e675fed3017a` | `10dc5dfab188fdc0` |
| `jeter-faro-trace-demo-backend` | client | `c2d6ab735804b499` | `ceb5e675fed3017a` |

**RUNTIME JOIN VERIFIED for this one Jeter Slow request.** The DevTools header supplies the browser context; Tempo independently verifies the same trace ID and the parent relationship. The Grafana frontend detail screenshot shows the frontend span ID. Grafana did not expose the backend parent field in the opened detail, so the equality is taught with a clearly labelled evidence comparison diagram rather than a fabricated Grafana screenshot.

## Error walkthrough evidence

A controlled uncaught error with marker `OTEL_VISUAL_CHECK_20260920_B` was scheduled in the stage demo. It did not alter business data. The real Jeter DevTools Console showed the marker. The real Network Payload for `POST /alloy` showed the same marker under `exceptions[]`; the real request detail showed HTTP 202. The authenticated Grafana Loki query:

```logql
{service_name="jeter-faro-trace-demo-frontend"} |= "OTEL_VISUAL_CHECK_20260920_B"
```

returned `Total: 1` and a matching exception row with the same marker, `kind=exception`, and `level=error`.

**FRONTEND ERROR → GRAFANA VERIFIED for this one controlled Jeter error.** Receiver acceptance and storage visibility are separate observations. The configured Alloy → Collector → Loki route is source/config evidence; this capture did not collect record-specific Collector receive/export metrics.

## Screenshot inventory

| Evidence | Real UI | Teaching overlay |
| --- | --- | --- |
| Jeter Slow page | `jeter-slow-scenario-redacted.png` base | red box on Slow action; employee ID masked |
| DevTools Network row | `jeter-network-slow-base.png` | red box on `slow` |
| DevTools request header | `jeter-traceparent-header-base.png` | red box on `traceparent` |
| Tempo query | `grafana-tempo-query-redacted.png` | red box on trace ID field |
| Tempo trace tree | `grafana-tempo-spans-redacted.png` | red box on frontend/backend rows |
| Tempo frontend detail | `grafana-frontend-span-id-base.png` | red box on frontend SpanID |
| Jeter Console | `jeter-error-console-base.png` | red box on controlled marker |
| Jeter Faro payload | `jeter-error-exceptions-base.png` | red box on `exceptions[]` marker |
| Jeter receiver result | `jeter-error-receiver-202-redacted.png` | red box on 202; internal address masked |
| Loki query | `grafana-loki-query-redacted.png` | red box on query |
| Loki result | `grafana-loki-result-redacted.png` | red box on matching marker |

The lesson also ships focused annotated crops with `-focus-annotated.png` names for the dense DevTools and Grafana views. They are selected with `<picture>` on narrow viewports so the marked observation remains legible without page-wide horizontal overflow.

## Boundaries preserved in the lesson

- `backendUrls` identifies business API URL patterns; it is not the Alloy endpoint.
- A browser `traceparent` header does not prove that both spans were exported or stored.
- HTTP 202 proves receiver acceptance, not downstream storage.
- The Loki result proves this marker is queryable; it does not prove every Collector hop for this record.
- The controlled error is an evidence walkthrough. No safe learner-facing error button was observed.
- Foreman business fields such as `data-link-name` and `subsystem` remain project-specific examples.

