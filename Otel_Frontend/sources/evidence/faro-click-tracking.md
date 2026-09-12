# Faro click-tracking contract and lifecycle

## Question / scope

確認 `@sre2/faro-click-tracking` 在目前版本的 click、user、device、environment、singleton 與 lifecycle contract，並把已證實的歷史與仍未知的原因分開。

## Verification metadata

- `verified_at`: 2026-09-12
- source/system: `garmin-tw-mfg-eng/faro-click-tracking`
- ref: `main`, tag `release/faro-click-tracking/v1.0.0`
- commit: `937d4a32e725877188a8d8a223529dece0449d4d`
- package manifest: `src/faro-click-tracking/package.json` version `0.0.0`（repository placeholder）；Foreman lockfile resolves published `@sre2/faro-click-tracking` `1.0.0`

## Verified findings

### Click contract

- `initFaro()` 的 `trackAttributes` 是選用設定；但一旦提供，**每個名稱都必須以 `data-` 開頭**。`validateTrackAttributes()` 在 `initializeFaro()` 前檢查，不合法或轉換後 key 重複會立即 throw。
- `ClickInstrumentation.initialize()` 在 `document` 註冊 bubbling `click` listener。非 `Element` target 直接忽略。
- 對每一個設定的 attribute，從 `event.target`（含自身）呼叫 `closest([attribute])` 向 ancestor 查找；找到才以 `getAttribute()` 取原值，未找到的欄位省略，不是錯誤。
- payload 只包含命中的 `trackAttributes`，不自動加入 `link_name`、`device_type` 或其他欄位。payload 為空物件時不呼叫 `pushEvent()`，也不佔用 throttle timestamp。
- key 先去除前綴 `data-`，再把其餘 `-` 改為 `_`；之後由 Faro/OTel translator 形成 `event_data_<key>`。
- 同一個 `EventTarget` 的事件在 300 ms 內只送第一筆；以 `WeakMap<EventTarget, number>` 記錄。超過 300 ms 可再送。`pushEvent('click', payload)` 是唯一送出呼叫。

### Initialisation, singleton and cleanup

- `environment` 是 required，`resolveCollectorUrl()` 以完整字串查內建表並附加 `/alloy`；host 沒有傳入任意 collector URL 的 API。
- `backendUrls` 只傳給 `TracingInstrumentation` 的 `propagateTraceHeaderCorsUrls`；它是後端 API URL pattern，不是 Alloy Faro receiver URL。
- `initFaro()` 呼叫順序為 singleton check → validation → `initializeFaro()` → `registerFaroInstance()`；成功後再次呼叫會在建立新 SDK instance 前 throw。
- `ClickInstrumentation.destroy()` 與 `UserSyncInstrumentation.destroy()` 會移除各自 listeners。裝置 detector 也有內部 `stopDeviceTypeDetection()`，但 `src/index.ts` 沒有公開 stop/dispose API；因此不能教成 host 有公開 `dispose()`。

### User

- `getUser` 型別為同步、便宜的 `() => FaroUserInfo | null`；儲存位置與格式由 host 決定。
- 提供 `getUser` 時，`UserSyncInstrumentation` 在 `click`、`visibilitychange`、`storage` 觸發同步，先比較 user id；變化時呼叫 `setFaroUser()` 或 `clearFaroUser()`。`initFaro()` 註冊 instance 後立即呼叫一次 `sync()`，涵蓋頁面載入時已登入。
- 未提供 `getUser` 時不建立 UserSync instrumentation，也不做初始同步；host 仍可使用公開 `setFaroUser`/`clearFaroUser`。

### Device

- `enableDeviceTypeDetection` 預設 `false`。開啟時以 `navigator.maxTouchPoints > 0` 作初始值，註冊全域 `pointerdown`；`pointerType === 'mouse'` 設為 `desktop`，`touch` 設為 `tablet`，其他（含 `pen`）不改變。
- 開啟時透過 `faro.metas.add(() => ({ device: { type: ... } }))` 加入 getter，因此每一種 signal 都可取得送出當下值；未開啟時不註冊 detector 或 device meta。這不是 DOM `data-*` payload。
- 目前 detector source 沒有讀取 `userAgent`、screen size、platform 或其他 heuristic；不要把這些欄位寫成現行判定依據。

## Evidence

- Click implementation: `src/faro-click-tracking/src/features/click/clickInstrumentation.ts:3-97`。
- Click tests: `src/faro-click-tracking/src/features/click/clickInstrumentation.test.ts:23-149`，覆蓋空 payload、ancestor lookup、key normalization、300 ms throttle。
- Init/validation/tracing/device: `src/faro-click-tracking/src/initFaro/initFaro.ts:13-146`；init tests `src/faro-click-tracking/src/initFaro/initFaro.test.ts:95-205`。
- User lifecycle: `src/faro-click-tracking/src/features/user/userSync.ts:5-71`。
- Device algorithm: `src/faro-click-tracking/src/features/device/deviceTypeDetector.ts:5-75`。
- Singleton/public surface: `src/faro-click-tracking/src/core/faroInstance/faroInstance.ts:6-47`、`src/faro-click-tracking/src/index.ts:1-9`。
- Environment map: `src/faro-click-tracking/src/features/environment/environmentUrls.ts:4-45`。

## Historical vs current

- PR #26（merge commit `f3c5a0de0dd267d62a7259748252b5247e734122`，2026-08-12）與其 tests/description 證實 `trackAttributes` 的 `data-*` validation、未命中欄位省略；它沒有留下「為什麼 mandatory」的作者理由。
- PR #30（merge commit `18464e867453dda0315ed51297bb17d1360863c6`，2026-08-13）加入 `toPayloadKey()`。code/test 明確把 `data-panel-topic` 轉成 `panel_topic`，理由是 translator 的 `event_data_` 欄位若保留 hyphen 會造成 Loki query 解析問題。這是 key normalization 的理由，不是 `data-*` mandatory 的證明。
- PR #31（merge commit `269322f01e922d6b85656e72e06e6cee5fd7294c`）確認 payload 僅由 host attributes 組成、空 payload 丟棄，並把 device detection 做成 opt-in；PR #32（merge commit `937d4a32e725877188a8d8a223529dece0449d4d`）為目前 release line。
- 初始實作 commit `ca043905366203c4f7dfae35b4f097e870201c36`（2026-08-04）已使用 data-attribute contract；後續 `7d8427b5fb147a29234fb6b3cbeba5138db24a0a`、`bd4c040a55ccdf8be30c659978c7bba5f2c5c4d` 延伸 link-name/data-attribute handling。`git log -S`、PR、tests 與歷史文件沒有證明過 `key`、`href`、`id`、`class` 或 `aria-*` 曾是正式支援的 `trackAttributes` 輸入。

## Unknown / not proven

- 為什麼最初把 `trackAttributes` 限制為 `data-*`：**Unknown**。不可把 Loki hyphen query 問題反推成唯一原因。
- 歷史上非 `data-*` attribute 是否曾可用：**Unknown**；目前 evidence 只證明 current contract 拒絕它們。
- Host 可否透過 package API 做完整 cleanup/dispose：**Not proven / current public API 沒有 dispose**；只能證實 SDK lifecycle 的 instrumentation destroy 與 package 內部 detector stop。
- source code 與 tests 證明設定與實作，不等同已在瀏覽器與 backend runtime 觀察到每一筆資料。

## Mission / Course relevance

- 直接支援 Lesson 2（listener、`closest()`、payload、empty、throttle、`data-*` invariant）。
- 支援 Lesson 3（environment URL、init order、singleton、public API、無 public dispose）。
- 支援 Lesson 4/7（user/device meta 與 `backendUrls` propagation boundary）。
- 支援 Lesson 9/10（key normalization 與 downstream `event_data_*` 欄位鏈）。
