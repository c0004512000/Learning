# Mission: 接手並維運 Faro 前後端可觀測性方案

## Why
接手既有的 Faro 前端監控方案，協助各專案導入、完成前後端 Trace 串接，並逐步承擔後續維運。學習的終點不是背誦文件，而是能以實際程式碼、瀏覽器與觀測平台證據判斷資料如何流動、哪裡失敗，以及如何安全修改或優化。

## Success looks like
- 能向前端、後端與 SRE 說明從瀏覽器事件到 Grafana／OpenSearch 的完整資料流與責任邊界。
- 能閱讀並修改 `@sre2/faro-click-tracking`，理解其初始化、click、user、device、environment 與 singleton 設計。
- 能協助宿主專案正確導入 SDK，並用 Browser DevTools 驗證 payload、meta、CORS 與 `traceparent`。
- 能完成並驗證前端 span 與後端 span 使用同一個 trace ID 串接。
- 能閱讀 Alloy／OTel Collector pipeline，定位 receiver、processor、exporter、Tempo／Loki／OpenSearch 任一環節的問題。
- 能完成 production 導入所需的 index、collector 與 dashboard／查詢驗證，並具備日後維運與優化能力。

## Constraints
- 8 份使用者提供的 HTML 是第一線主軸；其直接相關的 reference、code、PR、設定、Confluence、Grafana、OpenSearch、網站與 DevTools 證據均屬學習資料集。
- 文件與現況衝突時，區分「文件描述、歷史狀態、現行實作、實際 runtime 證據」，不靜默覆蓋。
- 不下載、安裝或執行額外 Windows executable；優先使用既有能力與唯讀檢查。
- 使用繁體中文（台灣用語），保留必要的英文技術名詞。

## Out of scope
- 從零重新選型或重新設計整套前端可觀測性平台。
- 與 Faro 導入、前後端串接及維運無關的 DE 平台、Kafka、Dremio、Cassandra 等延伸主題。
