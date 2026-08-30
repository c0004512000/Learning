# Mission: OpenTelemetry (OTel)

## Why
作為資深 SRE,需要補足 Observability 的深度能力：不只是會用監控工具,而是真正理解 OTel 的原理與資料模型,能獨立 debug 分散式系統的觀測性問題、在公司內部導入並維運 OTel、有能力向團隊教學分享,最終能設計出內部的 observability agent。

## Success looks like
- 能清楚解釋 Traces / Metrics / Logs 三大支柱的資料模型與彼此關聯 (trace context propagation, exemplars)
- 能用 Python 手動埋點 (manual instrumentation) 一個服務,產生 spans/metrics/logs 並送到 Collector
- 能讀懂並修改 OpenTelemetry Collector 的 pipeline 設定 (receivers/processors/exporters)
- 能在多服務架構中追蹤一條完整的 distributed trace,並診斷常見問題 (context 遺失、取樣異常、資料量爆炸)
- 能對 OTel SDK 的內部運作(Provider、Processor、Exporter、Resource、Sampler)有足夠理解,足以設計/擴充一個內部 observability agent
- 能將所學整理成教材,對團隊進行分享

## Constraints
- 目前 observability 三大支柱僅有概念性認識,幾乎從零開始
- 實作練習以 Python 為主要語言
- 學習分階段進行 (多個 session),需要可延續的教學紀錄
- 以第一性原理推導每個概念的 why/how,而非只記憶工具或指令的 what
- 不假設具備 Observability 前置知識；遇到必要前置概念時,建立可連結的獨立學習主題,不把它們硬塞進 OTel 課程

## Out of scope (暫緩)
- 特定商業 vendor 平台的深度整合細節 (Datadog/New Relic 等),除非未來明確需要
- 深入 profiling (第四支柱) 的細節,先聚焦 traces/metrics/logs
