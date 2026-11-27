# 2026-11-27 官方文件查核

- [Filesystem CLI](https://trivy.dev/docs/latest/guide/references/configuration/cli/trivy_filesystem/)：scanner、package types、skip、dev dependencies、輸出、exit code、DB、cache flags。預設值隨版本而變；list-all-pkgs 新舊版預設差異需查本機 help。
- [Configuration](https://trivy.dev/docs/latest/guide/configuration/)：CLI 明確值優先於環境變數及 YAML；預設設定檔依啟動目錄。
- [DB](https://trivy.dev/docs/latest/guide/configuration/db/)：vulnerability、Java index、checks bundle 不同；OCI 分發、skip/download-only 與 clean 操作。
- [Cache](https://trivy.dev/docs/latest/configuration/cache/)：scan cache 與 cache directory、memory/filesystem/Redis；併發須核對限制。
- [Reporting](https://trivy.dev/docs/latest/guide/configuration/reporting/)：JSON 欄位、SARIF、template、convert；四個核心漏洞欄位有值，其他欄位可能缺漏；轉換不能重建原始缺失內容。
- [Filtering](https://trivy.dev/docs/latest/guide/configuration/filtering/)、[Vulnerability](https://trivy.dev/docs/latest/guide/scanner/vulnerability/)：severity、status、suppression、severity source 與 detection priority。
- [Exit code](https://trivy.dev/docs/latest/configuration/others/)：findings 退出碼與執行失敗不同。
- [先前基準](2026-11-18-source-baseline.md)、[PoC](2026-11-19-cli-poc.md)：保留歷史證據；Image 實作不再列為此次導入要求，不能將當時樣本與 workflow 靜態檢查冒充當前實測。

查核官方文件與現有教材；未執行 Trivy、未驗證公司 Runner 或 Harbor。教學輸出明確標為示意，CLI 實驗為預期行為。未固定使用者目前的 CLI 版本，必須以當前安裝的 help 核對。
