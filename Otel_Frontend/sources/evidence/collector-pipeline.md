# Alloy → OTel Collector pipeline

## Question / scope

記錄 stage/prod 目前 Collector receiver、processors、exporters 與 environment routing，並將 Git desired state 與 runtime actual 分開；不保存任何 credential 值。

## Verification metadata

- `verified_at`: 2026-09-12
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

## Historical vs current

- Previous audit’s “stage upgraded / prod 0.101.0 / prod exporter points stage OpenSearch” claims were rechecked against runtime on 2026-09-12 and remain current.
- Stage Git appVersion and runtime image agree at 0.158.0. No equivalent prod desired-state source was located, so no inference is made about intended production version.

## Unknown / not proven

- Collector acceptance rate, queue/retry state and exporter delivery success were not measured; configuration and resource presence do not prove every record traversed the pipeline。
- Production desired Git source and reason for stage OpenSearch target are **Unknown**; do not teach the routing as intentional design.
- Secret backend/account values are configured through the referenced mechanism but intentionally not copied into Learning.

## Mission / Course relevance

- 支援 Lesson 9（receiver、filter、transform、exporter 與 stage/prod version boundary）。
- 支援 Lesson 10/11（OpenSearch routing、environment misrouting、production verification）。
- 支援 troubleshooting “Alloy 收到但 Collector 沒資料”與“送到錯誤 environment/cluster”；需以 runtime logs/metrics 進一步定位時，本 evidence 只提供 pipeline topology。
