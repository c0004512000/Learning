# OpenTelemetry debugging worksheet

## 1. Define the symptom

- Signal: traces / metrics / logs
- Entity (`service.namespace/name/version/instance`):
- Instrumentation scope:
- Expected record/stream:
- Observed result:
- Time window and timezone:
- First known occurrence / last known good:

## 2. Draw the expected path

```text
Source API/SDK
  -> processor/reader
  -> application exporter
  -> transport endpoint
  -> Collector receiver
  -> ordered processors
  -> sending queue/retry
  -> Collector exporter
  -> backend ingestion
  -> query/index/UI
```

## 3. Evidence table

| Boundary | Expected contract | Observed evidence | Pass / fail / unknown |
|---|---|---|---|
| Source recording | | | |
| SDK handoff/export | | | |
| Network/receiver | | | |
| Collector processing | | | |
| Collector queue/export | | | |
| Backend ingest/query | | | |

## 4. First broken boundary

- Lowest boundary known to pass:
- Immediately next boundary not proven:
- One hypothesis:
- Evidence that would confirm it:
- Evidence that would falsify it:
- One controlled change/test:

## 5. Invariant audit

- Resource identity stable and correct?
- Instrumentation Scope identifies producer?
- Context/parent/links expected?
- Sampling/recording decision expected?
- Span/metric/log limits or overflow visible?
- Metric temporality/reset handled?
- Sensitive data policy preserved?

## 6. Closeout

- Root cause:
- Detection gap:
- Guardrail/test added:
- Rollback/verification evidence:
- What remains unknown:

