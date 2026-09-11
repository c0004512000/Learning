# Lesson 2 learning record — `data-*` 與 DOM object 的關係

## Learner question

Lesson 2 在介紹 Faro `trackAttributes` 時，learner 暴露一個必要 prerequisite gap：

- `data-*` 跟原本的 DOM object 到底有什麼差異？
- `data-*` 本身是不是 DOM object？
- 是否需要為了 Faro 額外建立？
- 它與 `event.target` 指向的 DOM element 有什麼關係？

## Correct mental model

`data-*` 不是另一個獨立的 DOM element/object，也不是 Faro 專屬物件。

它首先是 HTML 的 custom data attribute。例如：

```html
<button data-link-name="daily-schedule">每日生產排程</button>
```

Browser parse HTML 後會建立對應的 DOM element object（此例為 `HTMLButtonElement`）。`data-link-name` 會成為這個 DOM element 上的一個 attribute，因此可以從 DOM API 讀取：

```js
const button = document.querySelector('button');
button.getAttribute('data-link-name'); // "daily-schedule"
button.dataset.linkName;              // "daily-schedule"
```

因此完整關係是：

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

`data-*` 與 DOM object 的關係是「element 上的 attribute」，不是「另一顆 DOM object」。嚴格 DOM API 中 attribute 可以有 `Attr` representation，但 Lesson 2 主線不需要先引入這個細節。

## Faro-specific boundary

Faro 不會自動替 host 建立這些 `data-*` attributes。

目前 `faro-click-tracking` package contract 要求 `trackAttributes` 只能指定 `data-*` 名稱；因此若 host 想提供一個原本不存在的 telemetry semantic，例如 `link_name`，通常需要在 HTML / JSX 額外加入：

```jsx
<button data-link-name="daily-schedule">...</button>
```

Browser 將它渲染成真正的 DOM attribute 後，ClickInstrumentation 才有東西可讀。

這不是 HTML / DOM 本身的限制。`id`、`href`、`class` 等原生 attributes 同樣存在於 DOM，也能被 JavaScript 讀；只是目前這個 package 的 `trackAttributes` validation 刻意只接受 `data-*`。

## Connection to `event.target`

`event.target` 指向的是被 click 的 DOM object，例如 `HTMLSpanElement` 或 `HTMLButtonElement`。

ClickInstrumentation 取得這個 DOM object 後，再從它開始：

```text
event.target (DOM element)
      │
      └── closest('[data-link-name]')
                │
                └── 找 target 自己或 ancestor 上的 data-link-name attribute
```

所以 `event.target` 與 `data-*` 並不是平行的兩套資料：

- `event.target` = 哪一顆 DOM element object 被 click
- `data-*` = 掛在 DOM element 上，提供額外語意的 attribute

## Curriculum correction

目前 Lesson 2 Section 4「為什麼 host 要自己加 `data-*`？」直接假設 learner 已理解 HTML attribute 與 DOM element object 的關係，順序過快。

Lesson 2 應在 Section 4 前增加一個短 prerequisite：

**「`data-*` 到底是 HTML、DOM，還是 Faro 的東西？」**

先建立：

```text
HTML attribute → Browser 建 DOM element object → attribute 存在於該 element → Faro 從 DOM 讀取
```

再進入「為什麼 host 為 Faro 額外新增 `data-*`」與 package-specific validation。