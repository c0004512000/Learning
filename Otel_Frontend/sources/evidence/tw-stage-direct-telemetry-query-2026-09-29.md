# tw-stage direct Tempo / Loki query access

## Question / scope

記錄 `tw-stage` 從本機直接查詢 Tempo 與 Loki 的可重用 endpoint、Istio routing 與實際 read-only API 驗證結果，避免後續驗證流程在已有 external query endpoint 時重新繞到 Grafana datasource proxy 或 Kubernetes port-forward。

本 evidence 只證明這些 direct query endpoints 與既有 telemetry 的可查詢性；**不**把既有資料查詢當成 Faro current-run persistence 證據。

## Verification metadata

- verified query window: `2026-09-28 19:25:46–19:55:46 UTC`
  - Asia/Taipei: `2026-09-29 03:25:46–03:55:46`
- direct queries executed around: `2026-09-28 20:01:04–20:01:05 UTC`
  - Asia/Taipei: `2026-09-29 04:01:04–04:01:05`
- Kubernetes context: `tw-stage`
- local access: HTTPS `443`; DNS and TLS succeeded
- authentication used: none
  - no `Authorization` header
  - no cookie
  - no browser session
  - no tenant header
- VPN requirement in general: **not confirmed**
- no file, configuration, or deployment modification was part of the validation run

## Confirmed direct query bases

| Backend | Direct query base | Kubernetes route |
|---|---|---|
| Tempo | `https://pek8s-staging.garmin.com:443/tempo` | `tempo-v3/VirtualService/tempo` → `tempo-distributed-v3-query-frontend:3200` |
| Loki | `https://pek8s-staging.garmin.com:443/loki` | `loki/VirtualService/loki` → `loki-query-frontend:3100` |

Both VirtualServices use:

```text
host:    pek8s-staging.garmin.com
gateway: istio-ingress/default-gateway
```

The backing Services are `ClusterIP`. External access comes from the Istio VirtualServices, **not** from a Service `EXTERNAL-IP`.

## Routing semantics

### Tempo

`tempo-v3/VirtualService/tempo` matches the external `/tempo` prefix, removes that prefix, and routes to:

```text
tempo-distributed-v3-query-frontend:3200
```

Therefore:

```text
https://pek8s-staging.garmin.com:443/tempo/api/search
```

reaches the Tempo query frontend as:

```text
/api/search
```

and trace detail uses:

```text
https://pek8s-staging.garmin.com:443/tempo/api/traces/<trace-id>
```

### Loki

`loki/VirtualService/loki` removes the **outer** external `/loki` prefix and routes to:

```text
loki-query-frontend:3100
```

Loki's native query API itself also begins with `/loki`, so the complete external `query_range` path is:

```text
https://pek8s-staging.garmin.com:443/loki/loki/api/v1/query_range
```

which reaches the backend as:

```text
/loki/api/v1/query_range
```

## Direct API validation

### Tempo

Search used the 30-minute window above with `limit=1`.

Observed:

- search: HTTP `200`
- content type: `application/json`
- candidates: `1`
- trace detail: HTTP `200`
- trace detail body: JSON
- returned detail: `1` batch / `1` span
- returned trace ID matched the canonical 32-character trace ID used for the detail request

This proves that the external `/tempo` route is usable from the local machine for direct Tempo API reads without Grafana authentication.

### Loki

The query used an exact selector returned by Loki's own `service_name` label values:

```logql
{service_name="TcsBackgroundService"}
```

with the same 30-minute window, `limit=1`, and `direction=backward`.

Observed:

- HTTP `200`
- content type: `application/json`
- API status: `success`
- result type: `streams`
- streams: `1`
- entries: `1`

This proves that the external `/loki` route is usable from the local machine for direct Loki API reads without Grafana authentication or a tenant header for the tested query.

## Reproducible commands

The following PowerShell commands do not set authentication, do not send cookies, do not disable TLS validation, and do not follow redirects. They print status and result counts rather than trace/log payload content.

### Tempo search and trace detail

```powershell
$tempoBase = 'https://pek8s-staging.garmin.com:443/tempo'
$endSec = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$startSec = $endSec - 1800

$search = Invoke-WebRequest `
  -Uri "$tempoBase/api/search?limit=1&start=$startSec&end=$endSec" `
  -Method Get -MaximumRedirection 0 -SkipHttpErrorCheck -TimeoutSec 30
$searchJson = $search.Content | ConvertFrom-Json
"search_status=$([int]$search.StatusCode) content_type=$($search.Headers['Content-Type']) candidates=$($searchJson.traces.Count)"

if ($searchJson.traces.Count -gt 0) {
  $traceId = ([string]$searchJson.traces[0].traceID).PadLeft(32, '0')
  $detail = Invoke-WebRequest `
    -Uri "$tempoBase/api/traces/$traceId" `
    -Method Get -MaximumRedirection 0 -SkipHttpErrorCheck -TimeoutSec 30
  $detailJson = $detail.Content | ConvertFrom-Json
  $spanCount = 0
  foreach ($batch in $detailJson.batches) {
    foreach ($scope in $batch.scopeSpans) {
      $spanCount += $scope.spans.Count
    }
  }
  "detail_status=$([int]$detail.StatusCode) content_type=$($detail.Headers['Content-Type']) batches=$($detailJson.batches.Count) spans=$spanCount"
}
```

### Loki exact selector and bounded `query_range`

```powershell
$lokiBase = 'https://pek8s-staging.garmin.com:443/loki'
$selector = [uri]::EscapeDataString('{service_name="TcsBackgroundService"}')
$endNs = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds() * 1000000
$startNs = $endNs - 1800L * 1000000000

$uri = "$lokiBase/loki/api/v1/query_range?query=$selector&start=$startNs&end=$endNs&limit=1&direction=backward"
$result = Invoke-WebRequest `
  -Uri $uri -Method Get -MaximumRedirection 0 -SkipHttpErrorCheck -TimeoutSec 30
$json = $result.Content | ConvertFrom-Json
$entries = 0
foreach ($stream in $json.data.result) {
  $entries += $stream.values.Count
}
"status=$([int]$result.StatusCode) content_type=$($result.Headers['Content-Type']) api_status=$($json.status) result_type=$($json.data.resultType) streams=$($json.data.result.Count) entries=$entries"
```

## Validation boundary

Confirmed:

- the external Tempo and Loki query bases are reachable from the tested local machine over HTTPS;
- the VirtualServices route to the intended `tw-stage` query frontends;
- the tested direct APIs returned real existing telemetry without Grafana auth, cookies, browser session, or tenant header;
- Kubernetes port-forward is **not required for this confirmed local direct-query path**.

Not confirmed:

- whether VPN is always required from other local/network contexts;
- whether every Tempo/Loki API path is anonymously accessible;
- whether these historical records came from the current Faro validation run;
- Faro current-run persistence for any new browser action.

For Faro acceptance, current-run request telemetry must still be correlated by the exact trace ID (or another request-specific identifier) and console/error telemetry by the exact unique marker and action time window.

## Mission / Course relevance

- Reusable evidence for the Faro persistence-validation path.
- Supports the distinction between **machine verification** and **Grafana human inspection**: direct Tempo/Loki APIs can establish persistence, while Grafana Explore remains the human-facing visualization handoff.
- Prevents treating Grafana datasource-proxy `401` or a missing localhost forward as evidence that the telemetry backend is unavailable.
