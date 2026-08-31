# Notes

- 使用者背景:資深 SRE,目標是補足 Observability 深度能力(理解原理、獨立 debug、導入維運、教學分享、設計內部 observability agent)。
- 目前對 observability 三大支柱(traces/metrics/logs)僅有概念性認識,幾乎從零開始。
- 實作練習偏好使用 Python。
- 使用者慣用語言:繁體中文(台灣用語),課程內容以中文撰寫,專有名詞保留英文原文並附中文解釋。
- 課程 UI 必須提供可切換的深色模式;未來 lesson 的 `<head>` 應在 `style.css` 後引用共用的 `assets/theme.js`。
- 描述事件順序、物件關係或因果性時，優先使用架構圖、流程圖、時間軸或心智圖，並明確標示不同箭頭的語義。
- 後續章節應連續撰寫；每完成並驗證一章後檢查 Codex weekly limit，剩餘低於 15% 才停止。
- 使用者是 SRE；每章可加入與該章基礎概念直接相關的 debugging 判讀或練習，作為應用與回饋迴路，但不可讓 troubleshooting 偏離第一性原理的 OTel 基礎主線。
- 2026-08-31 Lesson 2 學習回饋：使用者看完原版後仍無法理解 Tracing API、SDK、TracerProvider、Tracer、SpanProcessor、BatchSpanProcessor、Exporter、ConsoleSpanExporter；單純文字定義與「未知名詞方框互連」的圖無法建立心智模型。這些術語在使用者能自行解釋前，不得加入 GLOSSARY。
- SDK 架構的新術語必須先按層級分類：先區分 API/SDK 這種 architecture layer，再區分 Provider/Tracer 這種 runtime role/object，最後才介紹 BatchSpanProcessor/ConsoleSpanExporter 這種 concrete implementation。優先用實際 Python import、最小程式、package boundary 與「沒有 SDK vs 有 SDK」對照建立理解，再畫總圖。

## Teaching principles

- 以第一性原理教授：每個概念先回答它解決什麼問題、為何需要存在、如何運作，再介紹 API 或工具操作。
- 不預設使用者已具備 Observability 知識，但最終水準應能設計、debug、導入維運並教學，而不只是操作工具。
- 當 Kubernetes、networking、Prometheus 或其他前置主題成為真正的理解阻礙時，建立獨立且可回鏈到 OTel 的主題與學習地圖；不要在單一 OTel 課中塞入所有前置知識。

## Planned deep-dive sequence

- 使用者對 OTel 的底層資料模型有高度興趣,尤其是 Span 的欄位格式、常用 key 的語義、判讀方式、attributes 的用途,以及 context propagation 的運作。
- 教學決策:在 Python 實作前先以零程式碼 Lesson 2 補足 Trace API、SDK、TracerProvider、Tracer、SpanProcessor 與 Exporter 的角色，並明確區分 application startup configuration 與 per-operation runtime flow；Python 第一個 Span 順延為 Lesson 3。
- Lesson 2 已於 2026-08-31 依學習回饋改寫：不再以「零程式碼」為限制，而是用最小 Python import/object flow 先建立 API vs SDK、TracerProvider vs Tracer，再引入 Processor/Exporter；只有在使用者能回答核心 retrieval question 後才視為完成。
- 不可用未定義的 OTel 元件名稱組成線性流程圖。每個新術語必須先說明它解決的問題、責任邊界與和相鄰元件的關係，再出現在程式碼中。
- 深入課程必須區分:顯示用 JSON / Console 輸出、OTLP wire format、Span data model 與 Semantic Conventions；並涵蓋低 cardinality、敏感資料與 queryability 的取捨。
- 使用者對 `http.route` 與「API endpoint」的語義差異有疑問。資料模型課必須明確區分：routing template (`http.route`)、實際 URL (`url.full` / `url.path`)、目標 host (`server.address`)，以及 logical API operation (`http.request.method` + `http.route`，通常也是 server span name)；避免未限定含義地單獨使用「endpoint」。
