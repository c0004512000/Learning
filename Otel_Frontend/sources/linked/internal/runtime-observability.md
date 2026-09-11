# Linked internal source: read-only runtime endpoints

- verification timestamp: `2026-09-12` (Asia/Taipei)
- Kubernetes contexts/resources: `tw-stage` and `tw-prod`; namespaces `alloy`, `open-telemetry`, `mes1-frontend`; Deployments/DaemonSets/ConfigMaps queried with read-only `kubectl`.
- Grafana API roots: `https://pek8s-staging.garmin.com/grafana` and `https://shixpa-peproxy00.garmin.com/grafana`; GET `/api/search`, `/api/dashboards/uid/foreman-assistant`, `/api/datasources` only.
- OpenSearch API roots: `http://tw-opensearch-stage.garmin.com:9200` and `http://tw-opensearch-prod.garmin.com:9200`; GET `_cluster/health`, bounded `_cat/indices/ss4o_logs-foreman-assistant*`, `_mapping` and field queries only.
- why it matters: current-state images, ConfigMap resource versions, Grafana datasource/dashboard metadata, index existence and mappings. Credentials were supplied through the user’s environment mechanism; values intentionally omitted and no mutation endpoints were called.
