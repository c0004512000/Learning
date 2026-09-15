# DevTools Lab 需要先建立 panel literacy，再要求 learner 操作

已建立的教學約束：在 Browser DevTools Lab 中，不能直接從「看到 request」跳到要求 learner 自行判讀 Headers / Payload / Response。應先建立每一種 request role 與面板欄位的最小 mental model，再進入實作。

這次實際暴露出的 prerequisite 是：learner 能成功操作 Elements / Console 並取得 live DOM evidence，但對 `getEventListeners(document).click` 的大型回傳物件、Network request list、`preflight` 與實際 `POST` 的責任差異、以及 Headers / Payload / Response 各自回答什麼問題仍缺乏清楚模型。

後續相關教材應遵守：

- `getEventListeners()` 只先教 listener count、event type、capture mode、listener function name/location；其他 object internals 不應一起塞給 learner。
- listener registration 與 listener execution 必須分開；若需要證明 callback 真正執行，Lab 要提供 Event Listener Breakpoint 的明確操作步驟與 Call Stack 判讀，而不是一句「必要時可使用 breakpoint」。
- Network Lab 必須先教 request list 的最低必要欄位，再區分 `OPTIONS preflight` 與真正 telemetry `POST`。
- preflight 主要看 CORS request/response headers；POST 才用 Payload 做 telemetry correlation，再用 status/response 判斷 Browser → receiver boundary。
- 不應創造像 `TRACKING_VALUE` 這種只為教材方便存在、但 learner 會誤以為是系統概念或程式變數的 placeholder；直接使用「剛才從 live DOM 讀到的 `data-link-name` 值」。

這個約束之後應套用在所有以 DevTools、Grafana、OpenSearch 或類似工具做 hands-on debugging 的 Lesson：先教畫面如何讀，再要求 learner 用畫面做 evidence-based 判斷。