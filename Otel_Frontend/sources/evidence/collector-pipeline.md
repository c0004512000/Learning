# Alloy → OTel Collector pipeline

## Question / scope

記錄 stage/prod 目前 Collector receiver、processors、exporters 與 environment routing，並將 Git desired state 與 runtime actual 分開；不保存任何 credential 值。

## Verification metadata

- pipeline topology verified at: `2026-09-12`
- `tw-stage` direct Tempo/Loki query access verified at: `2026-09-29` Asia/Taipei
- source/system: `garmin-tw-mfg-eng/TW-None-Prod-Microservices`
- ref: `main`, commit `a59a4c45dd6bb2e0f8823827e0c878956d93935c`
- runtime contexts: Kubernetes `tw-stage` and `tw-prod`, namespaces `alloy` / `open-telemetry`, read-only

## Verified findings

### Shared ingress

- Alloy in both environments terminates Faro at port 12347 and exports OTLP gRPC to service `opentelemetry-collector.open-telemetry.svc.cluster.local:4317`.
- Collector runtime has OTLP gRPC `0.0.0.0:4317` and HTTP `0.0.0.0:4318` receivers. Collector does **not** need a second Faro receiver for this path; Alloy performs Faro receiver translation before OTLP export.

### Stage desired and actual

- Argo app `helm/argocd/tw-stage/applications/open-telemetry/opentelemetry-collector.yaml:14-30` deploys the stage chart path to namespace `open-telemetry`, targetRevision `main`.
- Stage chart `helm/infra-service/tw-stage/open-telemetry/opentelemetry-collector/Chart.yaml` declares appVersion `0.158.0`; runtime Deployment image is the private Harbor `opentelemetry-collector-contrib:0.158.0` image and is ready with one pod.
- `logs` pipeline sends OTLP HTTP to Loki gateway. `logs/opensearch` applies Kubernetes/resource/batch, `filter/only_foreman_assistant`, then `transform/opensearch_body`, and exports to OpenSearch. `traces` pipeline applies attribute/resource/filter/batch processing and exports OTLP to Tempo v3 distributor. Metrics use Prometheus exporter.
- Stage OpenSearch exporter endpoint is `http://tw-opensearch-stage.garmin.com:9200`, dataset `foreman-assistant`, namespace `tw-stage`, mapping `ss4o`.
- `filter/only_foreman_assistant` drops logs whose `resource.attributes["service.name"] != "foreman-assistant"`; the filter processor condition means matching the drop condition removes the record. `transform/opensearch_body` merges `ParseKeyValue(body)` into log attributes with `upsert` when body is a string.

### Stage direct query access

`tw-stage` now has verified local-machine direct query routes through `istio-ingress/default-gateway`:

- Tempo: `https://pek8s-staging.garmin.com:443/tempo` → `tempo-v3/tempo-distributed-v3-query-frontend:3200`
- Loki: `https://pek8s-staging.garmin.com:443/loki` → `loki/loki-query-frontend:3100`

Both backing Services are `ClusterIP`; the external path comes from Istio `VirtualService` routing rather than a Service `EXTERNAL-IP`.

Read-only local HTTPS queries succeeded without an `Authorization` header, cookie, browser session, or tenant header for the tested Tempo search/detail and Loki `query_range` APIs. Kubernetes port-forward is therefore **not required for this confirmed `tw-stage` local direct-query path**. Whether VPN is required from other network contexts remains unverified.

Loki keeps its native `/loki/api/...` path after the outer VirtualService prefix is removed, so external range queries use:

```text
https://pek8s-staging.garmin.com:443/loki/loki/api/v1/query_range
```

Detailed commands, routing semantics, timestamps, and validation boundaries are preserved in [`tw-stage-direct-telemetry-query-2026-09-29.md`](./tw-stage-direct-telemetry-query-2026-09-29.md).

These direct queries used existing telemetry and do **not** by themselves prove Faro current-run persistence. Current-run acceptance still requires correlation to the exact browser action.

### Production actual

- Runtime Deployment in namespace `tw-prod/open-telemetry` still uses `opentelemetry-collector-contrib:0.101.0` (three pods), not stage’s 0.158.0.
- Production receives OTLP from Alloy, then logs route to Loki; `logs/foreman-assistant` applies a Foreman-only filter and `transform/parse-body-to-attributes` before the OpenSearch exporter. Traces route to `tempo-distributed-distributor.tempo.svc.cluster.local:4317`.
- Production exporter target is **the stage OpenSearch endpoint** `http://tw-opensearch-stage.garmin.com:9200` with dataset `foreman-assistant`, namespace `tw-prod`, mapping `ss4o`. This is current misrouting evidence, not a recommendation.
- Production Collector ConfigMap has no Faro receiver; Alloy remains the Faro ingress. Other exporters (including SRE OTLP) are recorded only as configured destinations; credential values are intentionally omitted.

### Desired-state boundary

- This clone contains explicit stage Helm/Argo desired state. No corresponding tw-prod infra desired directory was found in the bounded scan; production runtime configuration is therefore the authoritative current-state evidence for prod routing, while the desired source for a future prod change remains **Unknown**.

## Evidence

- Stage Alloy source: `helm/infra-service/tw-stage/alloy/alloy/stage.values.yaml:30-56`。
- Stage Collector source: `helm/infra-service/tw-stage/open-telemetry/opentelemetry-collector/stage.values.yaml:3-5,49-74,131-150,163-211`。
- Stage Argo app: `helm/argocd/tw-stage/applications/open-telemetry/opentelemetry-collector.yaml:14-30`。
- Runtime resources: Deployments/DaemonSets and ConfigMaps in `tw-stage`/`tw-prod`, queried read-only on `2026-09-12`; current ConfigMap resource versions stage `1476167719`, prod `1428067135`.
- Processor semantics: OTel Collector filter/transform processor v0.101 references already indexed in `RESOURCES.md`; the runtime excerpts above are the configuration-specific evidence.
- `tw-stage` direct query evidence: `tempo-v3/VirtualService/tempo`, `loki/VirtualService/loki`, plus local direct Tempo/Loki API responses recorded in [`tw-stage-direct-telemetry-query-2026-09-29.md`](./tw-stage-direct-telemetry-query-2026-09-29.md).

## Historical vs current

- Previous audit’s “stage upgraded / prod 0.101.0 / prod exporter points stage OpenSearch” claims were rechecked against runtime on 2026-09-12 and remain current.
- Stage Git appVersion and runtime image agree at 0.158.0. No equivalent prod desired-state source was located, so no inference is made about intended production version.
- The earlier need to use localhost Kubernetes port-forwards for Tempo/Loki validation is historical for `tw-stage`; as of the 2026-09-29 verification, direct external query routes are proven from the tested local machine.

## Unknown / not proven

- Collector acceptance rate, queue/retry state and exporter delivery success were not measured; configuration and resource presence do not prove every record traversed the pipeline。
- Production desired Git source and reason for stage OpenSearch target are **Unknown**; do not teach the routing as intentional design.
- Secret backend/account values are configured through the referenced mechanism but intentionally not copied into Learning.
- General VPN requirements for the new `tw-stage` direct Tempo/Loki query routes are **Unknown** outside the tested local network context.

## Mission / Course relevance

- 支援 Lesson 9（receiver、filter、transform、exporter 與 stage/prod version boundary）。
- 支援 Lesson 10/11（OpenSearch routing、environment misrouting、production verification）。
- 支援 Faro persistence verification：在 `tw-stage` 優先使用已驗證的 direct Tempo/Loki external query routes，不把 Grafana datasource-proxy `401` 或 localhost forward 不存在誤判成 backend unavailable。
- 支援 troubleshooting “Alloy 收到但 Collector 沒資料”與“送到錯誤 environment/cluster”；需以 runtime logs/metrics 進一步定位時，本 evidence 只提供 pipeline topology。
