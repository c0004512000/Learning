# Faro `faro.performance.resource` runtime verification — 2026-09-21

## Purpose

Preserve the runtime evidence needed to teach one bounded operational question:

> When one Browser API call produces both tracing telemetry and `faro.performance.resource`, what are those two records, where does the performance event go in the current stage pipeline, and what Browser-side values are useful during debugging?

This evidence is intentionally scoped to the current Jeter stage demo and the verified stage pipeline. It is not a complete Browser Performance API reference.

## Verification metadata

- Browser observation time: 2026-09-20 16:39:16 UTC (2026-09-21 00:39 Asia/Taipei)
- Application: `jeter-faro-trace-demo-frontend`
- Environment in Faro meta: `tw-stage`
- Faro SDK observed in Browser payload: `faro-web` `2.11.0`
- Business request used for correlation: `GET /jeter-faro-trace-demo-backend/api/scenario/employee/1001`
- Grafana Explore datasource: Loki, UID `loki123`
- User/session identifiers are intentionally omitted from this durable evidence.

## Browser observation: one business request, two different Faro telemetry records

One user action caused one business API call to the employee endpoint. DevTools showed two separate `POST /alloy` requests whose payloads were not duplicates.

### POST A — Browser resource performance event

Observed payload contained:

```text
events[]
└─ name: faro.performance.resource
   domain: browser
   timestamp: 2026-09-20T16:39:16.101Z
   attributes.name:
     https://pek8s-staging.garmin.com/jeter-faro-trace-demo-backend/api/scenario/employee/1001
```

Important classification:

- This record is a Faro **event** describing Browser resource/network performance.
- This payload did not establish a trace/span merely because it referred to the same HTTP request.

### POST B — tracing telemetry

A separate `POST /alloy` payload contained:

```text
events[]
└─ name: faro.tracing.fetch
   timestamp: 2026-09-20T16:39:16.187Z
   trace.trace_id: <present>
   trace.span_id: <present>

traces
└─ resourceSpans: [...]
```

Important classification:

- This payload carried tracing telemetry.
- The `resourceSpans` branch is the span/trace signal relevant to Tempo.

Therefore the verified model for this one request is:

```text
one business GET /employee/1001
        |
        | observed by different Faro instrumentations
        |
        +--> faro.performance.resource  (event)
        |
        +--> faro.tracing.fetch + resourceSpans  (tracing)
```

The two `/alloy` requests are therefore not evidence that the business API was called twice, and they are not duplicate payloads.

## Current stage downstream path for `faro.performance.resource`

Runtime/config investigation established this path:

```text
Browser
  | POST /alloy containing faro.performance.resource
  v
Alloy
  | otelcol.receiver.faro.frontend
  | logs -> batch -> OTLP gRPC
  v
OpenTelemetry Collector
  | OTLP logs pipeline
  | batch -> otlp_http
  v
Loki OTLP endpoint
  v
Grafana Loki datasource
```

For this environment, the performance event is therefore visible downstream as an OTLP log record in Loki rather than as a Tempo span.

## Grafana / Loki runtime verification

Grafana Explore query:

```logql
{service_name="jeter-faro-trace-demo-frontend"} |= "faro.performance.resource" |= "/api/scenario/employee/1001"
```

Time range used: `now-7d`.

One matching record was observed with:

```text
timestamp=2026-09-20T16:39:16.101Z
kind=event
event_name=faro.performance.resource
event_domain=browser
event_data_name=https://pek8s-staging.garmin.com/jeter-faro-trace-demo-backend/api/scenario/employee/1001
event_data_responseStatus=200
service_name=jeter-faro-trace-demo-frontend
```

The same log record exposed Browser performance fields including:

```text
event_data_duration=84
event_data_ttfb=37
event_data_responseTime=1
event_data_transferSize=421
event_data_cacheHitStatus=fullLoad
event_data_initiatorType=fetch
```

Additional lower-level timing fields such as DNS, TCP, and TLS timing were also present, but they are not required for the current course unless a concrete network-setup problem makes them relevant.

## Debugging interpretation boundary

For the current learning Mission, use the two signals for different questions:

```text
Tempo trace
  -> Where did the distributed operation spend time?
  -> frontend / backend / DB / downstream spans

faro.performance.resource in Loki
  -> What did the Browser observe for this HTTP resource?
  -> URL / status / total duration / TTFB / response transfer / size / cache state
```

Do not teach a universal rule that API latency investigations must start with the performance event. When a complete trace is available, trace/span timing is the stronger tool for locating the slow operation. The performance event is complementary Browser-side evidence and can remain useful when a matching trace is unavailable, for example because tracing data was not retained or sampled.

## Practical fields in scope for the course

Only these commonly useful values need to be recognized at the current learning depth:

| Field | Operational question |
| --- | --- |
| `event_data_name` | Which API/resource is this record about? |
| `event_data_responseStatus` | What HTTP status did the Browser observe? |
| `event_data_duration` | Roughly how long did the Browser observe the full resource request taking? |
| `event_data_ttfb` | How long until the first response byte became available? |
| `event_data_responseTime` | How long was spent receiving the response portion represented by Faro's resource timing event? |
| `event_data_transferSize` | How much transfer data did the Browser report? |
| `event_data_cacheHitStatus` | Did Faro classify the resource as cache-related or a full load? |
| `event_data_initiatorType` | What Browser initiator type produced the resource entry, such as `fetch`? |

Do not require memorization of DNS/TCP/TLS sub-timings unless the active debugging scenario specifically reaches that fault domain.

## Upstream source basis

Grafana Faro Web SDK upstream history documents the resource-timing instrumentation and its evolution:

- resource/navigation timing instrumentation became enabled by default in Faro Web SDK 1.4.0;
- `responseStatus` was added to performance events in 1.5.0;
- `ttfb` was added to `faro.performance.resource` in 1.11.0;
- transfer size tracking was added in 1.18.0.

Source pointer: `grafana/faro-web-sdk` `CHANGELOG.md`.

These upstream facts establish that the fields are intentional Faro resource-performance telemetry. The exact stage storage route above is established by the current runtime/config evidence, not by the upstream changelog.

## Other backend observations

- Tempo: the separate tracing payload (`resourceSpans`) is routed to tracing storage; this evidence does **not** classify `faro.performance.resource` itself as a Tempo span.
- OpenSearch: the current logs/OpenSearch route observed during this investigation filters to `service.name=foreman-assistant`, so the Jeter frontend event is filtered from that route.
- Prometheus: the current relevant route is the OTLP metrics pipeline; no `faro.performance.resource` metric was observed.

## Limits

- Alloy counters are cumulative and cannot attribute one counter increment to this exact event.
- Loki storage visibility is directly verified for the matching record.
- No existing dashboard was modified or proven to visualize this Jeter resource event; Grafana Explore was used.
- This evidence does not claim that the event cannot be duplicated into some other backend by an uninspected route.
- The Browser observation proves two different telemetry payloads for one tested request; it does not establish a universal fixed number of `/alloy` POSTs for every request.
