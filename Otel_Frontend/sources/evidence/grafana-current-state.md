# Grafana datasource and Foreman dashboard current state

## Question / scope

確認 Mission 需要的 Grafana query surface：Foreman dashboard、Loki/Tempo/OpenSearch datasource 指向與 click field query。這是 current-state runtime evidence，不把 dashboard query 當成 pipeline implementation。

## Verification metadata

- `verified_at`: 2026-09-12
- runtime: Grafana stage `https://pek8s-staging.garmin.com/grafana`、prod `https://shixpa-peproxy00.garmin.com/grafana`, GET API only
- dashboard: uid `foreman-assistant`; stage id `225`, version `33`; prod id `159`, version `3`

## Verified findings

- Both stage and prod dashboards contain click panels whose Loki queries parse `kind="event"`, `event_name="click"`, `device_type`, `event_data_link_name` and `user_id`; aggregate panels group by `event_data_link_name` and/or `device_type`.
- Both dashboards use Loki datasource uid `loki123` for click/log panels and Tempo datasource uid `temp123` for “最近 Traces”. The dashboard JSON does not use the OpenSearch datasource for these panels.
- Stage relevant datasources include `de-stage-os-api` (Infinity, URL `http://tw-opensearch-stage.garmin.com:9200`), Loki `loki123`, and Tempo `temp123` (v3 query frontend). Prod has `de-prod-os-api` (Infinity, URL `http://tw-opensearch-prod.garmin.com:9200`), plus Loki/Tempo; it also exposes a stage OpenSearch datasource.
- The “後端 Logs” panel queries `{service_name="faro-poc-backend"}`. This label is not the Jeter backend service name (`jeter-faro-trace-demo-backend`), so dashboard/backend alignment is not proven and is a current **STALE/CONFLICTING** query-surface finding, not evidence that Jeter backend logs are absent.

## Evidence

- Grafana GET `/api/search?query=foreman-assistant`: stage id 225 and prod id 159, both uid `foreman-assistant`.
- Grafana GET `/api/dashboards/uid/foreman-assistant` at verification time: click panel query excerpts and datasource UIDs above.
- Grafana GET `/api/datasources` at verification time: stage/prod datasource names, UIDs and URLs above. Authorization token values were read from the user-provided environment file and never printed or stored.

## Historical vs current

- Dashboard versions differ materially (stage v33 vs prod v3), so a dashboard query copied from one environment is not automatically evidence for the other.
- OpenSearch index/mapping evidence is independent of dashboard panel choice; a Loki query proves dashboard intent/query syntax, not that the corresponding OpenSearch field is populated.

## Unknown / not proven

- Dashboard panel execution results and alert correctness were not queried; GET metadata only.
- Whether the backend log label is an intentional legacy service alias or stale dashboard configuration is **Unknown**; no dashboard edit was made.

## Mission / Course relevance

- 支援 Lesson 10/11 的 dashboard/query verification 與 environment datasource comparison。
- 支援 troubleshooting “Tempo 查不到 trace”與“查詢看不到預期 field”；先確認 dashboard datasource/query，再回到 raw runtime evidence。
