# Faro 主／支線對話：核查與教材覆蓋

## 範圍與證據層級

來源是 [兩份指定對話](../materials/2026-10-22-faro-conversation-materials.md)。所有知識點均已盤點；保留原有主線課程與先備依賴，不按對話先後增加一套重複 Lesson。使用者要求 review、整合並更新教材，因此本次另核對標準與 Faro v2.12.1 source；[外部來源與固定版本](../linked/external/faro-trace-batching-2026-10-22.md)與原始對話分列。

本次沒有連入內部 Grafana／Browser 應用重新產生 telemetry，沒有執行 Credential 建立、刪除或登入。標記為「來源案例」的 runtime 敘述只由原對話支援；既有 raw JSON／截圖則保留原採集日期。

## 知識點 → 可學習位置

| 知識點 | 教材與練習位置 |
|---|---|
| Business request 與 /alloy upload、instrumentation 與 transport | [Lesson 5](../../lessons/0005-faro-browser-to-alloy-transport.html)；沿用 Lesson 6 的實際 DevTools 截圖。 |
| meta、events、logs、exceptions、measurements、traces；event.trace 只作關聯 | [Lesson 5 #payload](../../lessons/0005-faro-browser-to-alloy-transport.html#payload)、[Reference 0010 #payload](../../reference/0010-trace-evidence-and-runtime-boundaries.html#payload)。 |
| Queue 的資料單位、兩層 batching、固定 timer／門檻／meta 分組 | [Lesson 5 #batch](../../lessons/0005-faro-browser-to-alloy-transport.html#batch)、[Reference 0011](../../reference/0011-faro-batching-and-queues.html)的時間線與三題 retrieval。 |
| 已排隊、HTTP 已送、202 accepted、storage 可查的差異 | Lesson 5／Reference 0011；[Lesson 8](../../lessons/0008-verifying-single-trace-browser-to-tempo.html)證據層級。 |
| traceparent 的四段、parent-id 與上游 spanId | 既有 Lesson 7／Reference 0006；[Reference 0010](../../reference/0010-trace-evidence-and-runtime-boundaries.html)以本次來源案例重用相同模型。 |
| Browser header、event pointer、完整 spans 的 ID 對照 | Reference 0010 與 Lesson 8；不把只出現 traces key 當成已比對完整 span。 |
| UI SpanID 與 raw parentSpanId、Base64／hex | Lesson 8 既有 Jeter 視覺證據；Reference 0010 的 IDP 對話摘錄與離線轉換。 |
| Resource/runtime/scope、CLIENT／SERVER、顏色與 downstream service | [Lesson 8 #runtime-boundary](../../lessons/0008-verifying-single-trace-browser-to-tempo.html#runtime-boundary)、Reference 0010 的 backend CLIENT 反例與 retrieval。 |
| Dashboard Job／service.name、filter、時間範圍與 exact Trace ID | Lesson 8 保留 PR #37 的 Resource identity；區分 10/05 case mismatch 與 10/20 對話中的舊分頁。 |
| 少了前端 span 的排查、舊 bundle、sampling／export／查詢限制 | Lesson 8 的預期→觀察→邊界表；Reference 0010。 |
| 重疊 downstream duration、不能直接加總或定位內部根因 | Reference 0010 的慢請求判讀。 |
| CORS frontend origin／traceparent、tracestate、safelisted／preflight | Lesson 5、既有 Reference 0004、Reference 0010 的限定 CORS 片段。 |
| 操作前捕捉、Preserve log 非追溯、abort／retry 的寫入風險 | Lesson 8 的安全採證起點與 Reference 0010。 |

這些教材仍使用共用 stylesheet、quiz 元件與真實返回連結。細節放 Reference，Lesson 保留主要概念順序；沒有建立未輪到的 Lessons 10–12。

## 核查結果與來源限定

| 原始敘述／易誤讀處 | 核查後採用的模型 |
|---|---|
| 「50 筆或 250 ms」 | Faro v2.12.1 的 50 是 TransportItems；250 ms 是啟動後固定 setInterval，不是每筆重設倒數。空 queue 不送；條件與 Browser 排程不形成送達 SLA。 |
| 「Trace 完成後約 1 秒再送」 | 預設 BSP scheduledDelayMillis=1000、maxExportBatchSize=30；自訂 spanProcessor 可替代。後面還有 Faro batching、network、downstream，不能以 1250 ms 當延遲上限。 |
| 「SDK 被要求 flush」 | 查到的是 BatchExecutor 私有 flush；不能直接教成宿主可呼叫的公共 API。hidden 只嘗試 flush 當下已有資料，不保證所有 span 在關頁前送達。 |
| 「同一次 flush 就是一個 POST」 | 以 JSON.stringify(meta) 分組，各組交給 sendFn；單次 flush 可以分成多組。 |
| 「每次操作有 /alloy，所以沒 batching」 | 單筆 batch 也有效；不同 instrumentation 產生時間不同。payload 內容才是分類依據，不能靠 request 數量證明 duplicate。 |
| 「traces key 與 event.trace 相同所以完整 join 成立」 | 要比對具體 T/A；event.trace 是指標，不是完整 span。Backend parent chain 與儲存可見性另驗證。 |
| 「parent-id 還是 spanId」 | W3C header 的欄位名是 parent-id，其值為上游當前 span ID；下游新 span 記成 parentSpanId。存在被 instrument 的中介時，驗證完整 ancestor chain，而非要求最終 backend 直接等於 Browser。 |
| 「Tempo JSON ID 一律 Base64」 | 該對話的 API 摘錄是 Base64 bytes；OTLP JSON 規範對 traceId/spanId 使用 hex。先辨認實際格式，不能把 hex 再當 Base64 解碼。 |
| 「黃色＝前端／CLIENT＝前端」 | 兩者都不是 runtime 邊界。用 service.name 與 Resource/runtime、scope、kind、parent chain 合併判讀；backend 出站也是 CLIENT。 |
| 「Server 沒 parent 表示當時 header 沒帶」 | 僅知可見記錄沒有有效 parent；可能有缺失／無效／未擷取／處理或儲存差異。沒有當時 header capture，不能反推唯一原因。 |
| 「刷新後成功證明一定是舊 bundle」 | 使用者回報支援此診斷方向；本次未保存前後 bundle comparison，不將相關性升格唯一因果。 |
| 「.WithHeaders(traceparent) 就是完整設定」 | 僅是概念片段；真實 method、Content-Type／Authorization 等 headers、credentials、middleware 與既有 policy 仍必須一致。tracestate 對基本 join 非必填，不能因此任意丟棄已使用的 vendor state。 |
| 「Abort 寫入不會建立資料」 | 原對話自己記錄 retry 意外建立；課程不要求在真實服務重播寫入來驗證 tracing。 |

Transport types 的 sendTimeout 註解描述「沒有新訊號後等待」；同版本 BatchExecutor 實際使用 setInterval。教材採用可執行實作的固定 tick 模型，保留這個 source 註解／實作差異，避免把它教成 debounce。

## 案例日期與 ID

- **2026-09-20 Jeter**：保留 repository 既有 Browser header、raw trace 與截圖；Lesson 8 的實際視覺教學仍使用這筆資料，不以新文字偽造新截圖。
- **2026-10-05 IDP Portal**：既有 evidence 的 lowercase `idp-portal` 與 Dashboard `IDP-Portal` mismatch，是當時的案例；不宣稱現在部署仍相同。
- **2026-10-20（對話記載）**：主要對話報告 uppercase `IDP-Portal`、舊分頁與重新操作後成功。匯出於 10/22，不重新命名成 10/22 runtime capture。
- **2026-10-22**：本次文件、source 與離線驗證日期，不是內部 telemetry 重現日期。

對話慢請求 ID `5f7fb789f9582463c383495332d1346` 為 31 個字元，與標準 32 位表示不符；沒有 raw response，不補字元也不據此宣稱當時 Tempo API 必定拒絕。

對話提供的另一條 Trace `fd778573afcedbadfb854d68716708cf` 的節錄：Portal spanId=`WdMbrwohow0=`，Keychain parentSpanId=`WdMbrwohow0=`，Keychain 自己 spanId=`k6tmuVMYCm8=`。本次離線確認：

```text
WdMbrwohow0= → 59d31baf0a21a30d
k6tmuVMYCm8= → 93ab66b953180a6f
```

這只驗證兩種表示的轉換與摘錄中的相等關係，不等同重新取得完整 trace。慢請求 40.372 秒 downstream 可定位主要等待區間，但不能單憑父子時間相加或一個 client span 的長度推斷遠端服務的內部根因。

## 學習狀態

主線仍為 Milestone 2／Lesson 3。新增與修正教材不等於 learner mastery；本次需要的教學約束記於 Learning Record 0015，既有 retrieval debt 不清除。PR #24 的語意／Device KPI 與 #37 的 Resource identity 均保留，來源日期與適用範圍各自獨立。
