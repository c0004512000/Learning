# DB lifecycle 修訂查核（2026-11-27）

來源：官方 https://github.com/aquasecurity/trivy-db README、https://trivy.dev/docs/latest/guide/configuration/db/、https://trivy.dev/docs/latest/configuration/cache/、https://trivy.dev/docs/latest/advanced/self-hosting/、https://trivy.dev/docs/latest/guide/references/configuration/cli/trivy_filesystem/，以及 aquasecurity/trivy 原始碼固定修訂 f94c2ef22036ec1d3f2a85d34ce686b75a82ea41。

- trivy-db README：每 6 小時建置，metadata 預設更新間隔 24 小時。此為排程與預設，不是可用性 SLA。
- pkg/db/db.go：必要檔案、DownloadedAt zero、schema 檢查、skip validate，再 isNewDB（now before NextUpdate OR now before DownloadedAt+1h）；下載成功才設定 DownloadedAt。DB read-only 初始化。缺檔且 skip 報錯。正常 metadata 且 schema 較新時報錯，較舊可更新。
- pkg/commands/operation/operation.go：DownloadDB 先 NeedsUpdate；需要才 Download，失敗回傳 error；download-only 非強制下載，沒有無條件舊 DB fallback。
- pkg/commands/artifact/run.go：standalone vuln DB 初始化與 DownloadDBOnly SkipScan；Java index 初始化與實際需求分開。
- pkg/flag/db_flags.go：download-db-only 和 skip-db-update 衝突、兩個 download-only 衝突；default repo、schema tag 補入。官方 docs：指定 repository 覆蓋預設，暫時性錯誤 fallback。
- 官方 Cache：fs 預設 memory 是 scan cache，vulnerability DB 仍存檔；file scan cache 有併發鎖限制；DB read-only 不等於並行更新安全。
- Self-hosting：OCI 封裝內 db.tar.gz，解壓兩個檔案，使用 Registry 工具複製封裝，不需啟動 Container。

範例 metadata、時間軸和 log 皆為明確標記的教學示意；未在 Runner 或 Harbor 執行。未取得學員實際 CLI 版本；版本相依判斷以固定源碼及官方文件為依據，實際使用版本需核對。公開 Pages 無法於本次 container 連網驗證。
