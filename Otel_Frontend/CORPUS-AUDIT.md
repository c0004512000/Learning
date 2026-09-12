# Corpus Audit

## Primary corpus

已保存 8 份原始 HTML 至 `sources/materials/`。已讀取正文、code/pre、連結、Confluence macro、嵌入圖片與 inline SVG；10 張嵌入 raster 圖另存於 `sources/materials/embedded-images/` 供視覺檢查。

## Verified extensions

- 先前 audit 曾取得 8 份 Confluence 頁面的 title、space、version 與 storage body；2026-09-12 以既有 page IDs 重取時回覆 404，因此不能把舊快照宣稱為目前仍可存取的 current state。
- 直接相關的 `Application for DE service`、`升級 Otel Stack`、`OpenSearch Connection`。
- Grafana／OpenTelemetry／web.dev／MDN 的直接官方 reference。
- Jeter stage 與 Foreman production 的實際 deployed JavaScript bundle。
- Stage／production `/alloy` CORS preflight：兩者均回覆 204，允許 POST、`content-type` 與 `traceparent`。

## Targeted extensions completed

- 已讀 `faro-click-tracking` 現行 README、package contract、公開 API 與核心模組；設計歷史文件已足以涵蓋課程所需決策，不再逐檔展開 archive。
- 已讀 Foreman PR #21 的導入演進，以及 Jeter `dev` 分支的 frontend、ASP.NET Core backend、SQLite 與 OTLP 設定。
- 已核對 stage/prod Helm 與 runtime ConfigMap、Grafana dashboard/datasource，以及 OpenSearch 實際 index。

## Findings that override stale HTML status

- Production OpenSearch pipeline 已存在，不再是 HTML 所寫的 TODO。
- Production exporter 目前指向 stage OpenSearch，但 namespace 為 `tw-prod`；因此 stage cluster 同時存在 `ss4o_logs-foreman-assistant-tw-stage` 與 `ss4o_logs-foreman-assistant-tw-prod`，production cluster 無相符 index。
- Stage Collector 已升級，production 仍為 `0.101.0`；目前兩邊仍透過 Alloy 接收 Faro，再以 OTLP 送 Collector。
- Runtime Collector ConfigMap 含可直接使用的 OpenSearch credential。教材不保存 credential；維運上應改用 Secret injection 並輪替既有密碼。

## Deliberately stopped

- 不擴張到與 Mission 無關的 DE、Kafka、Dremio、Cassandra 文件。
- 不逐一閱讀所有 OTel Stack 歷史 PR，只保留影響 Faro 架構、版本與維運的結論。
- 不讀取真實使用者事件內容；schema、query 與資料流證據已足以支撐教材。
- 互動式 DevTools 驗證保留為 Lesson 6 的實作活動，不再作為課程規劃前置阻塞。

## Durable evidence migration status (2026-09-12)

本 audit 的可重用技術結論已拆分至 `sources/evidence/`（package、Foreman、Jeter、Browser→Alloy、Collector、OpenSearch、Grafana）。但本檔仍保留原始 corpus 範圍、已查過的延伸來源、刻意停止的邊界與歷史線索，因此目前**不完全 redundant，不刪除**。本檔中的 summary 不取代 evidence files 的 exact path/ref/runtime timestamp。
