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
- 使用者對「從已理解的具體結果逐層反推必要元件」的教學方式反應良好；例如先從 Span 問「誰建立它？」推導 Tracer，再問「誰提供/管理 Tracer？」推導 TracerProvider。熟悉的結構類比（如 Python Logger）可作輔助，但不得取代精確定義。
- 每篇概念課結尾應提供一個簡短 Recap，以一句話重新定義本課核心名詞，方便快速複習。
- `/teach` 對話中的追問、質疑與被修正的心智模型不能只留在聊天紀錄；一旦它改變了教材的正確解釋、學習順序或已建立的理解，應回填到 GitHub Learning workspace。實際應如何回填要先依 Matt Pocock Learning Skill、MISSION、既有 lessons / references 與目前 ZPD 判斷，不可因單次追問任意覆蓋原 lesson 的學習目標。
- 回填新問題前要先檢查後續既有 lessons / references 是否已完整承擔該主題。若後面已有完整教學，前面只做理解當下所需的提示與導引；若新的深度需求屬技能練習而非原 lesson 的核心知識，可建立獨立 practice lesson 並從原 lesson 回鏈。
- 2026-09-03 Lesson 3 學習缺口：使用者不清楚「什麼時候該加 Span Attribute」與「debug 時如何知道 Span 是否真的 End」。Lesson 3 應只補足建立第一個 Span 當下必要的 Attribute 判斷與 Python lifecycle 證據；不要提前用尚未教過的 Event / Child Span 解釋 Attribute。Span / Event / Attribute 的完整設計邊界由 Lesson 5 負責，Lesson 3 / reference 僅導航到該課。
- 2026-09-04 Lesson 5 深度回饋：使用者需要更多 process-internal Span 例子，且原本 Queryability / Cardinality / Availability 的文字過於抽象；在概念第一次出現時應給具體 production 問題與反例，不要要求使用者自行推廣適用範圍。
- Lesson 5 維持「Span 邊界與欄位設計」的單一主題。Child Span 要明確說明為「仍是 Span，只是 parent 是另一個 Span」；Failure vs Log 只講理解 Span boundary 所需的最低差異，完整 Logs / Trace correlation 留在 Lesson 25；Availability 先講「資訊何時才存在」，head sampling 的正式因果關係留在 Lesson 9。
- 使用者特別重視 telemetry design / debugging 的 SRE 實戰能力。多個 production-style 情境、過度/不足埋點判讀、Span vs Log、Attribute 成本與從需求反推埋點，獨立放在 `0051-sre-telemetry-design-labs.html` 作為 Lesson 5 的深度技能練習，不改變主課 `0005 → 0006` 的順序。
- Reference card 的標題與內容必須一致；`0003-span-design-decision-card.html` 是 Lesson 5 的壓縮參考，聚焦 Span / Event / Attribute，其他進階主題以 forward link 導向正式 lesson。
- Quiz 正確答案位置不可形成可預測或持續固定的 pattern；此要求已寫入 Matt Pocock Learning Skill。不要修改 `assets/quiz.js` 做 shuffle。

## Teaching principles

- 以第一性原理式因果推導教授：從使用者最容易理解的具體事實、行為或產物開始，問「要讓這件事成立，下一個必要條件是什麼？」一次只引入一個新概念。
- 不得在某個上層概念的必要性尚未建立前先提到它；如果使用者卡住，退回最後一個已理解節點重新往前推，不再增加未知名詞。
- 優先使用使用者已熟悉的程式語言、工具或概念做結構類比，並清楚標示類比邊界。
- 不預設使用者已具備 Observability 知識，但最終水準應能設計、debug、導入維運並教學，而不只是操作工具。
- 當 Kubernetes、networking、Prometheus 或其他前置主題成為真正的理解阻礙時，建立獨立且可回鏈到 OTel 的主題與學習地圖；不要在單一 OTel 課中塞入所有前置知識。

## Planned deep-dive sequence

- 使用者對 OTel 的底層資料模型有高度興趣,尤其是 Span 的欄位格式、常用 key 的語義、判讀方式、attributes 的用途,以及 context propagation 的運作。
- 2026-09-01 Lesson 2 再次重構：不再從 API/SDK 開始，而是依序從 Span → Tracer → TracerProvider 推導；API/SDK 僅在上述角色已建立後做位置說明。Processor/Exporter 完全移到 Lesson 3，等「Span 已建立但如何看見/送出？」這個需求出現後才引入。
- 2026-09-01 Lesson 2 follow-up 修正：不要把 `get_tracer(name)` 教成「一段程式碼需要一個 Tracer」。同一個 Tracer 可以建立很多不同 Span；`name` 識別的是 Instrumentation Scope（telemetry 的邏輯產生來源），Tracer 本身不是 Trace tree 的節點。
- 2026-09-01 TracerProvider follow-up 修正：Provider 的必要性不能推導成「因為有很多 Tracer」。即使只有一個 Tracer，Provider 仍是 stateful configuration owner 與 Tracer access point；常見 Provider-level 設定先理解 Resource、Sampler、SpanProcessor，再延伸 SpanLimits、IdGenerator。
- Lesson 3 使用 `SimpleSpanProcessor` + `ConsoleSpanExporter` 建立最短可見 feedback loop；`BatchSpanProcessor` 的 queue/batch/timer 行為延後到真正需要討論 production performance/reliability 時再教。
- Lesson 3 的 Attribute 教學只從「這個值是否描述這一次 operation，以及是否能回答查詢／除錯問題」推導 Attribute；若問題開始涉及「某件事發生的時刻」或「是否需要另一個獨立工作節點」，不要在 Lesson 3 提前展開新模型，導向 Lesson 5。
- Lesson 5 聚焦 Span boundary 與相鄰的 Event / Attribute 選擇，不承擔完整 Logs 或 Sampling 教學；SRE 深度技能練習由 0051 sidecar lesson 承擔。
- Lesson 3 的 Span End 教學要區分「operation 已完成」與「資料已 export/store」；Python `with start_as_current_span` 離開 block 會 End，手動 `start_span` 則需呼叫 `end()`。沒有 console 輸出不能直接反推 Span 未 End。
- 不可用未定義的 OTel 元件名稱組成線性流程圖。每個新術語必須先說明它解決的問題、責任邊界與和相鄰元件的關係，再出現在程式碼或完整架構圖中。
- 深入課程必須區分:顯示用 JSON / Console 輸出、OTLP wire format、Span data model 與 Semantic Conventions；並涵蓋低 cardinality、敏感資料與 queryability 的取捨。
- 使用者對 `http.route` 與「API endpoint」的語義差異有疑問。資料模型課必須明確區分：routing template (`http.route`)、實際 URL (`url.full` / `url.path`)、目標 host (`server.address`)，以及 logical API operation (`http.request.method` + `http.route`，通常也是 server span name)；避免未限定含義地單獨使用「endpoint」。
