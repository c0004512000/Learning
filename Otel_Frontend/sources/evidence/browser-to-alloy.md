# Browser Faro endpoint and Alloy receiver

## Question / scope

確認 package environment resolver、stage/prod `/alloy` receiver、CORS preflight 與 Alloy→Collector output；只做 read-only verification，未送出 telemetry POST。

## Verification metadata

- `verified_at`: 2026-09-12
- package source: `garmin-tw-mfg-eng/faro-click-tracking` `main` / `937d4a32e725877188a8d8a223529dece0449d4d`
- infrastructure source: `garmin-tw-mfg-eng/TW-None-Prod-Microservices` `main` / `a59a4c45dd6bb2e0f8823827e0c878956d93935c`
- runtime: `tw-stage` and `tw-prod`, read-only

## Verified findings

### Endpoint and transport contract

- `environmentUrls.ts:4-45` 的 resolver 將 `tw-stage` 解析為 `https://pek8s-staging.garmin.com/alloy`，`tw-prod` 解析為 `https://shixpa-peproxy00.garmin.com/alloy`；host 只給 environment，不直接給 URL。
- Alloy stage/prod ConfigMap 都有 `otelcol.receiver.faro "frontend"`，listen `0.0.0.0:12347`，並以 `output.logs`/`output.traces` 接到 batch，再由 OTLP exporter 送 Collector gRPC `opentelemetry-collector.open-telemetry.svc.cluster.local:4317`。
- Alloy chart route 將 `/alloy` path 導至 service port 12347；stage desired state 另明確記錄 virtual service host `pek8s-staging.garmin.com`。

### Current CORS evidence

- 2026-09-12 對 stage `https://pek8s-staging.garmin.com/alloy` 與 prod `https://shixpa-peproxy00.garmin.com/alloy` 發送 `OPTIONS`（沒有 POST body），Origin 為各自 host，要求 method `POST`、headers `content-type,x-faro-session-id,traceparent`。
- 兩者均回 `204`，`Access-Control-Allow-Origin: *`、`Access-Control-Allow-Methods: POST`、`Access-Control-Allow-Headers: content-type,x-faro-session-id,traceparent`。這足以驗證 preflight contract，不等於實際 Faro POST 已成功寫入 telemetry。

### Runtime receiver

- stage Alloy DaemonSet image `docker.io/grafana/alloy:v1.18.0`；prod image `linxpa-peprdharbor00.garmin.com/kube/alloy:v1.18.0`。兩者 service 都暴露 receiver port 12347。
- stage/prod runtime ConfigMap 均保留 Faro receiver、`*` origins/headers、batch 與上述 cluster-local OTLP output。ConfigMap resource versions（stage `1408726868`、prod `1404712562`）與 creation time 已在查詢時記錄；不保存 secret。

## Evidence

- Resolver: `faro-click-tracking/src/features/environment/environmentUrls.ts:4-45`。
- Desired Alloy config: `TW-None-Prod-Microservices/helm/infra-service/tw-stage/alloy/alloy/stage.values.yaml:30-56,62-75`。
- Argo stage app path/namespace: `helm/argocd/tw-stage/applications/alloy/alloy.yaml:14-30`。
- Runtime ConfigMaps/DaemonSets: Kubernetes namespaces `alloy`, stage/prod, queried read-only at `2026-09-12`。
- CORS checks: HTTP `OPTIONS` to the two exact endpoints, `2026-09-12`; no telemetry POST was sent.

## Unknown / not proven

- Actual POST response/body, Faro SDK retry/queue outcome and Alloy accepted-record count were not exercised in this pass to avoid writing external telemetry; **Unknown**。
- CORS is currently permissive (`*`); source does not prove whether an upstream gateway applies a narrower policy for every route. The observed endpoint responses are the current runtime evidence。

## Mission / Course relevance

- 支援 Lesson 5/6（environment→endpoint、DevTools CORS/header inspection）。
- 支援 Lesson 9（Alloy Faro receiver→OTLP Collector boundary）。
- 支援 troubleshooting symptoms “CORS failure” 與 “Faro event 有產生但 request 未送出”；POST-level delivery 仍需安全的專用驗證環境。
