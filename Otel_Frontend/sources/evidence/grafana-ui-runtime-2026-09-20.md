# Grafana Explore UI runtime verification — 2026-09-20

## Verification metadata

- `verified_at`: 2026-09-20 04:18 Asia/Taipei (2026-09-19 20:18 UTC)
- Environment: `tw-stage`; Grafana: `https://pek8s-staging.garmin.com/grafana`
- Application: Jeter Faro Trace Demo
- Relevant version: Grafana version was not read from the UI; datasource UIDs `temp123` (Tempo) and `loki123` (Loki) were confirmed by authenticated API earlier in this pass. The Jeter deployed image versions were not rechecked.
- Reproduction: existing authenticated Chrome window; real Grafana Explore UI, no simulated page.
- Raw record: [UI verification projection](raw/grafana-ui-runtime-2026-09-20.json). Matching Browser/Tempo/Loki record IDs are in [trace evidence](frontend-backend-trace-runtime-2026-09-20.md) and [error evidence](frontend-error-grafana-runtime-2026-09-20.md).

## Tempo UI observation — RUNTIME EVIDENCE

1. In Explore, selected Tempo and entered trace ID `6faa6779a2970a3f82ad77e9ab9f4eb7` in the TraceQL/trace ID field.
2. Grafana opened the trace for Jeter's Slow scenario. The result showed the frontend root operation, HTTP 200 and **3 spans**.
3. The expanded `Service & Operation` tree visibly showed `jeter-faro-trace-demo-frontend` above `jeter-faro-trace-demo-backend`, with the backend child operation below. The exact span IDs and parent equality remain established by the corresponding Tempo API record, since this UI view displays hierarchy rather than all IDs at once.

Screenshots: [query and trace result](../../assets/special-lesson-evidence/grafana-tempo-query-redacted.png) / [annotated query](../../assets/special-lesson-evidence/grafana-tempo-query-annotated.png); [frontend/backend span tree](../../assets/special-lesson-evidence/grafana-tempo-spans-redacted.png) / [annotated span tree](../../assets/special-lesson-evidence/grafana-tempo-spans-annotated.png).

## Loki UI observation — RUNTIME EVIDENCE

1. Opened a separate Explore pane with Loki datasource. Entered `{service_name="jeter-faro-trace-demo-frontend"} |= "OTEL_FRONTEND_EVIDENCE_20260920_0415"` and bounded the time range to 2026-09-19 20:02–20:06 UTC.
2. Grafana showed **Total: 1** and a log row at 2026-09-20 04:03:09.202 Asia/Taipei. The visible row identifies `kind=exception`, `level=error`, and the unique marker. The same marker appears in the Chrome Faro POST projection and the authenticated Loki API result.

Screenshots: [datasource/query and result count](../../assets/special-lesson-evidence/grafana-loki-query-redacted.png) / [annotated query](../../assets/special-lesson-evidence/grafana-loki-query-annotated.png); [matching log row](../../assets/special-lesson-evidence/grafana-loki-result-redacted.png) / [annotated result](../../assets/special-lesson-evidence/grafana-loki-result-annotated.png).

## Privacy and teaching overlays

All eight repository screenshots come from real Grafana UI. The account avatar was masked in pixels. The Loki result's lower log text was masked because the actual row contains user/session fields; the timestamp, exception kind and unique marker remain visible. The `*-redacted.png` images are the privacy-safe base captures; `*-annotated.png` adds one red rectangle at the learner's current reading point. Red rectangles are teaching overlays, not native Grafana UI. Unmasked source captures were kept outside the repository and are not evidence artifacts.

## Previous state and limitations

**Current runtime differs from previous verified state.** Earlier on 2026-09-20, Grafana UI redirected to SSO while authenticated datasource API queries worked. After the learner signed in to the Chrome Grafana window, the actual Explore UI became available. The earlier API observations were not overwritten.

This UI pass verifies the specific Jeter trace and error result. It does not establish record-specific Collector receive/export metrics, nor does it claim the existing Foreman dashboard presents this Jeter data. No dashboard or infrastructure was changed.
