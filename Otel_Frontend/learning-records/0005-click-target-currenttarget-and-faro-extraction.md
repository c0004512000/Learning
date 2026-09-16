# target / currentTarget 與 Faro click extraction 邊界

已建立的理解：`event.currentTarget` 代表目前正在執行 listener 的 DOM object；在 Faro ClickInstrumentation 的 document listener 中就是 `document`。`event.target` 則保留這次 click 最初命中的 element，所以即使 listener 掛在 `document`，ClickInstrumentation 仍必須從 `event.target` 開始，用 `closest()` 沿 ancestor chain 找 configured `data-*` attributes。

在已查證的 Foreman Assistant source revision 中，`trackAttributes` 只有 `data-link-name`。這個 attribute 由 Foreman developer 放在 template / DOM 上，Faro package 不會自行建立；package 只負責讀取並將命中的 `data-link-name` 轉成 click payload 的 `link_name`。User 與 device 資訊屬於其他 Faro metadata / instrumentation 路徑，不是 ClickInstrumentation 從 DOM 抽出的 click attributes。

這個理解之後可作為 Lesson 2 之後的基礎，不需要再把「listener 掛在哪裡」與「telemetry extraction 從哪裡開始」混在一起。

## Source verification — 2026-09-17

本 record 原本只有結論，沒有 path、revision 或 snippet。本次重新直接讀取 source，主要 extraction 結論與以下 pinned revisions 一致；**沒有證明 2026-09-17 最新遠端 HEAD**。完整歷史、逐一 markup inventory、SDK/Alloy 資料流與 evidence audit 見 [調查報告](../sources/evidence/data-link-name-investigation-2026-09-17.md)。

- Foreman：`4e032babef7aa30e5d13d7a506abe208945a5dee`。
- 公司 Faro package：`937d4a32e725877188a8d8a223529dece0449d4d`。

Host configuration：`XD-Foreman-Assistant/foreman-assistant/src/main.ts:29`：

```ts
trackAttributes: ['data-link-name'],
```

DOM render declaration：`foreman-assistant/src/app/layout/main/main.component.html:46`：

```html
[attr.data-link-name]="item.subsystem"
```

同 repo 的 `src/app/shared/toolbar/toolbar.component.html:86,105,117,129,143` 另有五個固定值，全部掛在 `<p-button>` host。Main 的 `item.subsystem` 由 `main.component.ts:setPanelList()` 的 `Subsytem` enum entries 建立，不是由 Faro 從 hyperlink text 或 route name 推導。

Listener：`faro-click-tracking/src/faro-click-tracking/src/features/click/clickInstrumentation.ts:90–92`：

```ts
initialize(): void {
  document.addEventListener('click', this.handleClick);
}
```

Extraction / key normalization：同檔 :29–42,58–73：

```ts
const target = event.target;
// getTrackedAttributeValue(element, attributeName):
const marked = element.closest(`[${attributeName}]`);
// 找不到時回傳 undefined；找到時：
return marked.getAttribute(attributeName) ?? undefined;
// toPayloadKey(attributeName):
return attributeName.replace(/^data-/, '').replace(/-/g, '_');
// handleClick 的 configured attribute loop：
payload[toPayloadKey(attributeName)] = value;
```

這些是各函式的 relevant excerpts，並非連續的一個函式。Package 實際使用泛用 attribute selector；Foreman 的 config 使它查找 `[data-link-name]`。`currentTarget` 是 document listener 的執行位置，但 package source 沒有讀取 `event.currentTarget`。Bubbling 被阻止的 click 不會到達此 document listener；不是所有 click 無條件都能被收到。

User/device 路徑：`src/faro-click-tracking/src/initFaro/initFaro.ts:116,130,142,145`：

```ts
const userSync = config.getUser ? new UserSyncInstrumentation(config.getUser) : undefined;
// instrumentations array:
...(userSync ? [userSync] : []),
// enableDeviceTypeDetection branch:
faro.metas.add(() => ({ device: { type: getCurrentDeviceType() } }));
// initial sync:
userSync?.sync();
```

UserSync 在 `src/features/user/userSync.ts` 呼叫 `setFaroUser(user)`；`src/features/user/faroUser.ts:21–23` 實際接到 Faro user API：

```ts
getFaroInstanceOrThrow('setFaroUser').api.setUser(user);
```

歷史邊界：Foreman 的 DOM attribute **與 Faro 導入一起加入**，首次可達 commit 是 PR #21 的 `f4a3688d3beed8f8448b78583cd93985884cff23`（2026-08-20）；其 parent 沒有 `data-link-name`。原本就有的是 subsystem 等 stable identifiers，不是此 DOM attribute。原 record 的「developer 放在 template 上」不能延伸成「導入前原本就存在」。
