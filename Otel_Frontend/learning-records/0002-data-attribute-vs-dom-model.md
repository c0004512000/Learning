# Lesson 2 learning record — `data-*`、DOM object 與導入範圍

## Learner question

Lesson 2 在介紹 Faro `trackAttributes` 時，learner 暴露一個必要 prerequisite gap：

- `data-*` 跟原本的 DOM object 到底有什麼差異？
- `data-*` 本身是不是 DOM object？
- 是否需要為了 Faro 額外建立？
- 它與 `event.target` 指向的 DOM element 有什麼關係？
- 實際導入時是否代表所有 button 都要額外加 attribute？

## Correct mental model

`data-*` 不是另一個獨立的 DOM element/object，也不是 Faro 專屬物件。

它首先是 HTML 的 custom data attribute。例如：

```html
<button data-link-name="daily-schedule">每日生產排程</button>
```

Browser parse HTML 後會建立對應的 DOM element object（此例為 `HTMLButtonElement`）。`data-link-name` 是這個 DOM element 上的一個 attribute，因此可以從 DOM API 讀取：

```js
const button = document.querySelector('button');
button.getAttribute('data-link-name'); // "daily-schedule"
button.dataset.linkName;              // "daily-schedule"
```

完整關係：

```text
HTML / JSX 宣告
<button data-link-name="daily-schedule">
        │
        │ Browser parse / render
        ▼
DOM element object
HTMLButtonElement
  └── attribute: data-link-name="daily-schedule"
        │
        │ ClickInstrumentation 透過 closest()/getAttribute() 讀取
        ▼
Faro payload
{ link_name: "daily-schedule" }
```

`event.target` 與 `data-*` 不是平行資料：

- `event.target` = 這次 click 的 DOM element object。
- `data-*` = 掛在 DOM element 上的 attribute。

## Retrieval evidence

2026-09-11 learner 對以下題目回答 **B**：

```html
<button id="schedule" data-link-name="daily-schedule">
```

Browser parse 後是：

> 一顆 button DOM object，上面有 `id` 與 `data-link-name` attributes。

此 prerequisite 已有一次正確 retrieval evidence。這代表目前可以在 Lesson 2 主線中繼續使用這個模型，但不等同永久 mastered。

## Current package contract — definitive

Faro 不會自動替 host application 建立這些 `data-*` attributes。

目前 `faro-click-tracking` 的 `trackAttributes` validation 明確要求每個名稱必須以 `data-` 開頭；非 `data-*` 會在初始化時報錯。因此不是「通常」要這樣做，而是現行 package contract 的硬性限制。

若 host 要讓某個 telemetry semantic 被 ClickInstrumentation 擷取，例如 `link_name`，該值必須存在於 target → ancestor DOM path 上某個被設定於 `trackAttributes` 的 `data-*` attribute。

這不是 HTML / DOM 本身的限制。`id`、`href`、`class` 等原生 attributes 仍存在於 DOM，也能被 JavaScript 讀，只是目前這個 package 不接受它們直接作為 `trackAttributes`。

## Does every button need `data-*`?

**No.** 現行機制是 global listener + payload opt-in，而不是「所有 button 都必須標記」。

```text
browser click
  ↓
document listener 有機會收到
  ↓
依 trackAttributes 從 target 往 ancestor 找 data-*
  ↓
至少一個命中 → 非空 payload → 可 pushEvent
完全沒命中   → payload={} → return，不送 Faro click event
```

因此真正規則是：

- 不需要觀測的 interaction，可以完全沒有 tracked `data-*`。
- 共用 context，例如 `data-page`、`data-panel-topic`，可以放 ancestor，讓 descendant clicks 透過 `closest()` 共用，不必複製到每顆 button。
- 如果需求是「要知道具體是哪個 logical action 被點擊」，則該 action 的 target → ancestor path 必須存在能區分 action 的 semantic，例如不同的 `data-action` / `data-link-name`。
- 只放共同 ancestor context 雖然可能讓 click 被送出，但會失去 action identity。

Example:

```html
<section data-page="production">
  <button data-action="save">儲存</button>
  <button data-action="cancel">取消</button>
</section>
```

```ts
trackAttributes: ['data-page', 'data-action']
```

Save:

```json
{ "page": "production", "action": "save" }
```

Cancel:

```json
{ "page": "production", "action": "cancel" }
```

如果兩顆 button 都沒有 `data-action`、只有 ancestor 的 `data-page`，兩個 click 都可能只得到 `{ "page": "production" }`，因此無法區分是哪個 action。

## Implementation implication

「document 上只有一條 listener」解決的是 JS event listener 數量與統一收集入口；它不可能憑空知道每個 UI 的業務語意。

實際導入應先定義需要觀測的 business interactions，再決定 semantic attributes，而不是把 `data-*` 無差別加到所有 DOM nodes。

如果 application 有共用 Button / Link component，可以考慮讓 component 接受 telemetry semantic prop，再集中 render 成 `data-*`，降低每個頁面手寫 raw attributes 的成本。這是 integration architecture 建議，不是目前 `faro-click-tracking` package 自動提供的功能。

## Historical reason boundary

目前 source corpus 與現行 implementation 足以證實：

- 現在 `trackAttributes` 強制 `data-*`。
- host 必須提供需要追蹤的 custom attributes。
- payload 只由 trackAttributes 命中結果組成。
- `toPayloadKey()` 的歷史問題與 downstream Loki 欄位名稱中的連字號有明確證據。

但「為什麼最初決定把所有 trackAttributes 限制成 `data-*`」的完整作者動機／PR 歷史，目前仍沒有足夠 evidence 可以斷言。不能把 `toPayloadKey()` 的 Loki 問題直接反推成 `data-*` mandatory 的唯一原因。

## Curriculum correction applied

Lesson 2 已正式修正，不再只記錄 gap。教材現在在進入 `closest()` 前先建立：

```text
HTML attribute
  → Browser 建 DOM element object
  → data-* 是該 element 的 attribute
  → event.target 指向 DOM element
  → ClickInstrumentation 從 target/ancestor 找 data-*
  → non-empty payload 才送 Faro event
```

並加入「是否每顆 button 都要加 attribute」的導入情境與 retrieval 題。