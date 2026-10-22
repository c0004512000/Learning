# Frontend Faro Skill design findings — evidence boundary

- `verified_at`: 2026-09-20 Asia/Taipei
- Scope: prospective Agent workflow, **not a Skill implementation or Special Lesson**.
- Applications: Foreman example for Faro/click browser telemetry; Jeter example for frontend/backend tracing configuration and demo API reachability. They are separate runtime flows.
- Evidence basis: [Foreman integration](foreman-integration.md), [Jeter integration](jeter-integration-and-tracing.md), [Browser to Alloy](browser-to-alloy.md), [Collector pipeline](collector-pipeline.md), [trace context](trace-context-propagation.md), and the two dated runtime assessments above.
- Raw evidence: [Jeter Browser request](raw/jeter-browser-network-2026-09-20.json), [matching Tempo trace](raw/jeter-tempo-trace-2026-09-20.json), [Jeter error Browser telemetry](raw/jeter-frontend-error-browser-2026-09-20.json), [matching Loki result](raw/jeter-error-loki-result-2026-09-20.json). Screenshot: [real Jeter page with privacy masking](../../assets/special-lesson-evidence/jeter-demo-page-raw.png) and [red-box annotation](../../assets/special-lesson-evidence/jeter-slow-scenario-annotated.png).

| Step for a future Agent | Scope | Evidence/decision boundary |
| --- | --- | --- |
| 1. Detect frontend framework | generic | Foreman uses Angular; Jeter uses React. Inspect the target repo. |
| 2. Detect package manager | generic | Inspect lockfiles and scripts in the target repo. |
| 3. Detect existing Faro dependency | generic | Avoid duplicate instrumentation. |
| 4. Find application entry point | generic | Foreman `main.ts`, Jeter `main.tsx` are examples, not universal paths. |
| 5. Find existing Faro initialization | generic | Preserve its current placement and options where valid. |
| 6. Find runtime environment/config source | generic | Jeter `/config.js` precedence and Foreman environment literal are project-specific implementations. |
| 7. Detect HTTP mechanism: fetch, XHR, axios, custom client | generic | Inspect actual outbound calls and wrappers; do not assume fetch. |
| 8. Detect backend base URLs | generic | Values and deployment origin are project-specific. |
| 9. Determine trace propagation URL patterns | generic concept, project-specific values | `backendUrls` is reusable configuration; match real business API URLs, not `/alloy`. |
| 10. Check frontend error instrumentation | generic | Jeter stage demo proves one controlled uncaught error reached Faro and Loki. Other repos need their own runtime proof. |
| 11. Check API request tracing | generic | Jeter Slow scenario proves one Browser request, `traceparent`, frontend client span and backend server span join. |
| 12. Preserve existing business instrumentation | generic rule; business details project-specific | Foreman `data-link-name` and subsystem values are **Foreman-specific**, not universal requirements. |
| 13. Apply minimal code changes | generic | Change only missing integration points in the target repo. |
| 14. Build/test | generic | Use that repo's existing scripts and conventions. |
| 15. Verify browser telemetry | generic | Real DevTools request/payload/status; 202 proves receiver acceptance only. |
| 16. Verify collector delivery | generic | Trace a record through actual receiver, pipeline, and exporter/storage evidence. |
| 17. Verify Grafana visibility | generic | Execute query against correct datasource; distinguish existing dashboard behavior from current-data query. |
| 18. If backend tracing exists, verify correlation | generic conditional | Same trace ID and client span ID = backend parent span ID in Tempo. The Jeter Slow scenario now proves this for one request. |

## Design implications

- The future Skill needs a strict evidence ladder: code/config → Browser runtime → outbound telemetry → receiver → Collector → storage → Grafana. Mark the first unproven boundary; do not upgrade inference to fact.
- Business request propagation and Faro telemetry export are separate network paths. The Agent must inspect both.
- Foreman Stage's observed `tw-prod` Faro environment/receiver must be recorded as observed runtime state, without assuming design intent.
- A dashboard's stored JSON is not proof that a panel returns current data. Existing query behavior and a correct current-runtime query need separate records.
- No application source, infrastructure, or dashboard was modified for this evidence pass.
