# Evidence gap report

`verified_at`: 2026-09-12（所有 runtime 查詢均為 read-only）。本表只把原本只有 summary、可能 stale 或會改變 Mission 解讀的 claim 列入；已有可重現 provenance 的項目標示為「無需重查」。

## Inventory and dispositions

| Claim / appearance | Current status | Currently available evidence | Missing evidence | Verification result / exact source and revision |
|---|---|---|---|---|
| Lesson 1：browser click 由 `document` listener、event target/path 與 bubbling 形成（Lesson 1、learning record 0001、reference） | VERIFIED | 原始 HTML、`learning-records/0001-browser-dom-event-prerequisites.md`、WHATWG references 已有 exact pointers | 無 Mission-critical gap；實作操作仍留給 Lesson activity | 不重查；只修正 map/source path wording。主線材料 `sources/materials/3. Faro-Click-Tracking Introduction (for developer).html`；背景規格在既有 reference。 |
| `ClickInstrumentation` 的 listener、`closest()` ancestor lookup、命中欄位、空 payload 與 300 ms throttle（Lesson 2） | VERIFIED | package source + Vitest tests + release tag | 無 | 已重建於 [`sources/evidence/faro-click-tracking.md`](sources/evidence/faro-click-tracking.md)；`faro-click-tracking` `937d4a32e725877188a8d8a223529dece0449d4d`，files `src/features/click/clickInstrumentation.ts:3-97`、test `:23-149`。 |
| Lesson 2 / learning record 0002 先前把 `trackAttributes` 的 `data-*` 限制弱化成 host 偏好 | VERIFIED（修正已完成） | current validation 明確 `name.startsWith('data-')`，錯誤發生於 SDK init 前；tests 覆蓋 invalid `page`；Lesson 2 quiz/recap 與 learning record 現已明寫 requirement | 無 current-text gap；歷史動機另列 Unknown | 已確認 source 實際是「每個名稱 SHALL 以 `data-` 開頭」，並保留此 invariant。精確 source `src/initFaro/initFaro.ts:81-100`、test `:133-161`，HEAD `937d4a32...`。 |
| `data-panel-topic → panel_topic` normalization 與 data-* mandatory 有同一原因（Lesson 2、歷史 material） | INSUFFICIENT（因果過度擴張） | current `toPayloadKey()`、test、PR #30 說明 `event_data_...` hyphen 造成 Loki query 問題 | 沒有證據證明這也是最初 data-* mandatory 的原因 | normalization rationale VERIFIED；mandatory rationale Unknown。PR #30 merge `18464e867453dda0315ed51297bb17d1360863c6`、`clickInstrumentation.ts:25-31`；禁止把兩者合併成單一因果。 |
| package init、environment URL、singleton/repeated init、public API、cleanup（Lesson 3） | VERIFIED（cleanup scope 有界） | `initFaro.ts`、singleton module、index exports、tests | 無 public dispose 的額外證據不會被補成事實 | [`faro-click-tracking.md`](sources/evidence/faro-click-tracking.md)；`initFaro.ts:103-146`、`core/faroInstance/faroInstance.ts:6-47`、`src/index.ts:1-9`。可證實 instrumentation `destroy()`，不可宣稱 host 有 `dispose()`。 |
| user callback / device algorithm / environment semantics（Lesson 4） | VERIFIED | package source + tests；Foreman/Jeter host source | runtime user PII 與每一筆 meta delivery 未取樣（安全/範圍限制） | package facts 已收錄於 [`faro-click-tracking.md`](sources/evidence/faro-click-tracking.md)；`userSync.ts:5-71`、`deviceTypeDetector.ts:5-75`、`environmentUrls.ts:4-45`。 |
| Foreman Faro init、`data-link-name` placement、user source、device opt-in（Lesson 2/4/6） | VERIFIED CURRENT STATE | `XD-Foreman-Assistant` main source、templates、PR #21、package lock、runtime deployment | 尚未逐一 browser-click proof 所有 controls | [`foreman-integration.md`](sources/evidence/foreman-integration.md)；repo `4e032babef7aa30e5d13d7a506abe208945a5dee`，`src/main.ts:11-34`、templates `main.component.html:42-84` / `toolbar.component.html:81-145`。 |
| Foreman 有 shared Button/Link、所有 business interaction 都被覆蓋、wrapper 會不會丟 attribute（Lesson 2/6） | INSUFFICIENT（部分已核對） | bounded scan：25 HTML、48 `p-button`、2 native `button`、2 anchors、7 `data-*` refs；未找到 app-level generic Button/Link；PrimeNG 18.0.2 source 證實 host ancestor path | 尚缺 semantic interaction inventory、future wrapper/portal evidence、browser runtime proof | 現況可報「未找到 generic shared component」，不可推成全 app coverage。PrimeNG tag `18.0.2` commit `aaef4d94aabcbdbc58e0d523a52f23ae05660810` 的 `packages/primeng/src/button/button.ts` 證實 inner button + host ancestor。 |
| Jeter frontend `initFaro`/backendUrls/user/device 與 runtime config precedence（Lesson 4/7） | VERIFIED CURRENT CONFIG | Jeter `dev` source、OpenSpec、stage deployment env | 實際 request/header 尚未取樣 | [`jeter-integration-and-tracing.md`](sources/evidence/jeter-integration-and-tracing.md)；commit `3edd27eb44ac2af13d5c987f68e2be232aa0f6dd`，frontend `src/main.tsx:3-35`、`authState.ts:1-41`。 |
| Browser `traceparent` → backend parent → OTLP → Tempo 真的共享同一 trace ID（Lesson 7/8） | INSUFFICIENT | frontend `backendUrls` config、ASP.NET Core OTel instrumentation、OTLP endpoints、local Alloy/Collector config | paired browser network capture + backend span parent/trace ID + Tempo query result | configuration path VERIFIED，runtime join NOT PROVEN；不得把 source comment 當 runtime result。見 [`jeter-integration-and-tracing.md`](sources/evidence/jeter-integration-and-tracing.md)，backend `Program.cs:50-66`。 |
| Browser → Alloy endpoint、HTTP/CORS、allowed `traceparent` header（Lesson 5/6） | VERIFIED CURRENT STATE | package resolver、stage/prod `OPTIONS` 204 responses（2026-09-12）、runtime Alloy ConfigMaps | 未送 POST，故無 payload acceptance/delivery proof | [`browser-to-alloy.md`](sources/evidence/browser-to-alloy.md)；endpoints `https://pek8s-staging.garmin.com/alloy` / `https://shixpa-peproxy00.garmin.com/alloy`，allow POST and `content-type,x-faro-session-id,traceparent`。 |
| Alloy → Collector stage/prod receiver、processor、exporter、version（Lesson 9/11） | VERIFIED CURRENT STATE | stage Helm/Argo desired source + stage/prod runtime ConfigMaps/Deployments | prod desired-state source absent；queue/export delivery metrics未查 | [`collector-pipeline.md`](sources/evidence/collector-pipeline.md)；stage runtime `0.158.0` / ConfigMap rv `1476167719`，prod runtime `0.101.0` / rv `1428067135`，read-only 2026-09-12。 |
| Faro `event_data_` → Collector transform → OpenSearch field/index/environment（Lesson 9/10/11） | VERIFIED CURRENT STATE（routing conflict recorded） | pinned upstream translator、package normalization、runtime transform/filter/exporter、OpenSearch mapping/index/field queries | future translator/index changes；production routing intent | [`opensearch-field-lifecycle.md`](sources/evidence/opensearch-field-lifecycle.md)；stage cluster has `ss4o_logs-foreman-assistant-tw-stage` and `...-tw-prod`; prod cluster bounded pattern returned `[]`，current prod exporter still points stage endpoint。 |
| Grafana Foreman dashboard 查詢代表 current OpenSearch/Tempo truth（Lesson 10/11） | CONFLICTING / STALE（query surface） | stage dashboard id 225 v33、prod id 159 v3；click panels use Loki `loki123` and Tempo `temp123`; OpenSearch datasource exists separately | panel execution result、backend label alias intent | [`grafana-current-state.md`](sources/evidence/grafana-current-state.md)；兩環境 dashboard 的 backend logs query `{service_name="faro-poc-backend"}` 與 Jeter service name 不一致，未修改 dashboard。 |
| Confluence page title/version/body 仍是目前 truth（RESOURCES、CORPUS-AUDIT） | INSUFFICIENT for current fetch; learner material remains provenance | 8 saved HTML 與 page IDs/version metadata；read-only API GET recorded IDs returned 404 | current page re-fetch/availability；不應把 404 當刪除證明 | [`sources/linked/internal/confluence-material-pointers.md`](sources/linked/internal/confluence-material-pointers.md)；原始 materials 仍是 learner-designated source。 |

## Confirmed factual defects / stale teaching statements

### Lesson 2 `data-*` wording audit pattern

- 先前版本曾把 `trackAttributes` 對 `data-*` 的硬性限制弱化成 host「希望」使用；這是本輪沿用的 audit pattern。現行 branch 的 Lesson 2 已有明確「強制只接受 `data-*`」、`href` 初始化失敗的 quiz 與 learning record 強調 validation requirement，因此目前**沒有尚未修正的 data-* factual defect**。
- Source 實際建立的事實：`initFaro()` 對清單逐項執行 `name.startsWith('data-')` validation；任何非 `data-*` 名稱在呼叫 `initializeFaro()` 前 throw。這是 requirement/validation，不是 recommendation。
- 仍需保留的邊界：key normalization 的 Loki rationale 不能被寫成 data-* mandatory 的唯一歷史原因；該歷史原因仍 Unknown。

沒有另外確認的 factual defect：PrimeNG `p-button` 的 attribute 放在 host 並非錯誤；18.0.2 source 顯示 inner native button 仍以 ancestor 關係連到 host，符合 package `closest()` contract。

### Lesson 2 的 shared-component provenance statement

- 原句：`現有 learning repo ... 沒有保存「shared Button / Link 是否存在」的 source-scan 結果 ... 真正採用這個方案前必須重新 ... verification`。
- Source 實際建立的事實：本輪已用 Foreman `main` HEAD 做 bounded scan，保存了 component paths、markup counts 與 PrimeNG 18.0.2 render behavior；scan 未找到 app-level generic shared Button/Link。
- 問題：在 evidence 已補齊後仍說「沒有保存」是 stale provenance statement，會讓 learner 重做已完成的查核；但它不應被改寫成「所有 interaction 都經過 shared component」。
- 建議修正：保留「integration pattern 不是現況」的界線，改為「Foreman bounded scan 未找到 generic shared Button/Link；未來 wrapper/portal 與其他 application 仍需 targeted verification」。本輪已在 Lesson 2 將此 stale sentence 改為上述限定說法。

## Troubleshooting evidence readiness

| 症狀 | Evidence readiness | Remaining gap |
|---|---|---|
| 1. click listener 沒收到 click | PARTIAL | package listener/target contract 已 verified；仍需 host browser capture 判斷實際 target/path。 |
| 2. listener 收到但 payload 為空 | VERIFIED for package logic | host DOM placement/runtime target 仍需 DevTools reproduction。 |
| 3. Faro event 有產生但 HTTP request 沒送出 | PARTIAL | endpoint/CORS verified；未送 POST，缺 request/queue evidence。 |
| 4. CORS failure | VERIFIED baseline | 2026-09-12 stage/prod preflight success；其他 Origin/gateway path 未查。 |
| 5. Alloy 收到但 Collector 沒資料 | PARTIAL | topology/config/runtime versions verified；缺 receiver/exporter runtime metrics/logs。 |
| 6. `traceparent` 沒產生 | PARTIAL | `backendUrls` wiring verified；缺 browser network capture。 |
| 7. backend 沒 join frontend trace | INSUFFICIENT | 需 paired traceparent/backend parent evidence。 |
| 8. Tempo 查不到 trace | INSUFFICIENT | dashboard datasource/config verified；需實際 trace lookup。 |
| 9. OpenSearch 沒有預期 field | VERIFIED field model | future/current query execution仍需以 timestamp + index mapping 檢查。 |
| 10. telemetry 送到錯誤 environment/cluster | VERIFIED current misrouting | prod desired intent/reason Unknown；runtime currently stage OpenSearch target。 |

## What was not re-researched

- 既有 8 份 learner HTML 的正文、DOM prerequisite、已具 exact provenance 的 reference 與 learning records；它們直接整理進 source map，沒有重做同一研究。
- Matt Pocock learner-facing `reference/` 沒有修改。
- 未擴張到 Mission 以外的 DE/Kafka/Dremio/Cassandra，也未掃描全部 OTel 歷史 PR。
