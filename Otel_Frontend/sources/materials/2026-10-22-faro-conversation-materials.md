# 2026-10-22 Faro 主線／Queue 支線學習材料

## 來源與保存方式

使用者於 2026-10-22 指定以下兩份完整 Markdown 附件作為本次教材更新依據。兩份檔案的全部內容均已讀取；本檔是來源索引與知識點摘要，不是逐字完整對話副本。原始附件保留於該次對話，不將 session ID、內部操作網址與行政性匯出往返重複公開到 learning repository。

| 附件 | 角色 | SHA-256 |
|---|---|---|
| `conversation-record(1).md` | 主要排查對話；從建立 Credential 後確認 telemetry 開始 | `35029e87cd328715840f42de555f6f9eb7a5ba30b9b100fe0fd96aee7bb6aaa0` |
| `conversation-record-current-session.md` | 從主要對話的 batching 說明分出的 queue 支線 | `fac676f290c8a7de8e6a8e95809290507f0317484764019977a03e31a49f219e` |

匯出日期是 2026-10-22，不等於每筆操作日期。主線的慢請求在記錄中標示為 2026-10-20；未提供時區，不自行換算。主線 `Parent context` 只有標題、沒有父回覆正文；多段 Assistant 回覆以省略號截斷，工具原始輸出與提及的截圖未附入。本次不補造這些內容。

支線保留的父訊息是「確認 telemetry 傳送狀態，也就是先等到 50 筆，或等待約 250 ms。」其後討論補足該句省略的 queue 單位與 timer 模型。

## 來源中的知識點

| 原始位置 | 來源內容與教學需求 |
|---|---|
| 主線 Turns 1–2 | 操作前開啟 Network、Preserve log；區分 business request 與 collector upload；沒有原始 header 時，以時間、method、URL、service 找候選 trace。Dashboard 篩選與實際 trace 是否存在是不同問題。 |
| 主線 Turns 2–4 | 後端有 trace、前端不見時，分查 instrumentation、propagation、export、query 與頁面 runtime。使用者回報原頁面是舊分頁，再試 POST 後成功。這是使用者觀察，不是本次重新捕捉的 bundle 證據。 |
| 主線 Turn 3 | 原先試圖 abort 寫入請求的驗證被 OAuth retry 繞過，意外建立測試資料；安全教學不可把單次攔截當成無副作用保證。 |
| 主線 Turns 4–5 | 一次操作可以產生多種 telemetry、多個 batches；meta／events／traces 各有角色；event.trace 與完整 spans 不相同。 |
| 主線 Turns 5–7 | traceparent 四段意義；header 的 parent-id 承載上游 spanId；下游建立新 spanId，並用上游 ID 作為 parentSpanId。Browser 自己可見的證據與 Tempo 匯集的證據不同。 |
| 主線 Turns 6–8 | UI SpanID 不等於已看見 parentSpanId；raw JSON、Base64／hex 與 parent equality。以 Resource、runtime、instrumentation scope 與關係辨認前後端，不以顏色或 CLIENT／SERVER 單獨分類。 |
| 主線 Turn 8 | Backend 呼叫另一服務時也會有 CLIENT span；IAM Topology 出現在鏈中須依實際父子關係解讀，不能由顏色猜部署角色。 |
| 主線 Turns 9–11 | 跨來源允許 frontend origin 與 traceparent 的 CORS 示意；tracestate 對基本關聯不是必填，但實際送出的 headers 與既有 policy 仍需核對。 |
| Queue 支線主要問答 | TransportItem、span、操作與 POST 的計數單位；兩層 queue；固定 interval、門檻與 hidden flush；meta 分組；單筆 batch 與多 POST 的判讀。 |

主線 Turns 12–15 與支線後段是匯出範圍澄清，不另建立 observability 課程內容。

## 保留而不擴大原始證據

- 原文的 `5f7fb789f9582463c383495332d1346` 只有 31 位。保留原字串，不自行補零或猜字元；不能單憑這點判定當時 Tempo 查詢必然失敗。
- 原文報告的 `fd778573afcedbadfb854d68716708cf` trace 與 parent/span JSON 摘要可作來源案例；本次沒有取得它的完整 raw trace 或重新查詢內部 Tempo。
- 原文「舊分頁」與重試成功支援 runtime-version 排查方向，但不足以排除所有其他因素。
- 原文的 timer／SDK／CORS 敘述需要版本化核查；修正與限定條件不改寫成原文一開始就有的內容。

[逐項核查與教材對照](../evidence/faro-conversation-verification-2026-10-22.md) · [Learning Map](../../learning-map/index.html)
