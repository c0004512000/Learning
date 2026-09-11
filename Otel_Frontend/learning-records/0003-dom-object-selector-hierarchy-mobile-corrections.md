# Learning Record 0003 — DOM object、selector、hierarchy 與 mobile 教材修正

Date: 2026-09-12

## Why this record exists

Learner 對 Lesson 1 的實際閱讀再次暴露教材同步問題：learning record / reference 已經記下正確模型，但主 Lesson 仍殘留舊例子與容易誤解的表達，造成 durable material 與目前 ZPD 不一致。

這次不是新增主線知識，而是把所有目前會直接教 learner 的教材統一到同一套模型。

## Learner feedback that must remain durable

### 1. 「DOM JavaScript object」會造成錯誤心智模型

Learner 的核心疑問：DOM 明明是瀏覽器在管理，為什麼教材又說成 JavaScript object？

正確模型固定為：

```text
HTML source
  ↓ Browser parse
Browser 建立並管理 DOM objects
  ↓ Browser exposes DOM APIs
JavaScript 取得 DOM object reference
```

因此後續教材不得使用會暗示「DOM 是 JavaScript 建出來」的說法。

`HTMLButtonElement` 應解釋為：對應 HTML `<button>` 的 DOM 介面／物件型別名稱。

不要額外引入不存在且會混淆的「HTML object」分類。

### 2. 範例 id 不得像未定義術語

舊教材直接使用 `#schedule`，learner 無法判斷它是 browser 內建概念、專案既有 id，還是作者隨便取的名稱。

之後固定使用較自我描述的範例：

```html
<button id="daily-schedule-button">每日生產排程</button>
```

並在第一次出現時當場定義：

```text
daily-schedule-button
→ 範例作者自己取的 id

#daily-schedule-button
→ CSS selector，表示找 id="daily-schedule-button" 的 element
```

### 3. DOM hierarchy 圖不能讓 nested nodes 看起來平行

Learner 曾因圖形排版誤以為 `html`、`body`、`main`、`button` 是平行關係。

後續 parent / child hierarchy 優先使用單一文字 tree：

```text
Document
└── html
    └── body
        └── main
            └── button
```

且必須明確標示：縮排表示 parent / child，不是 event flow。

若同一頁還需要畫 Event flow，必須另外標示箭頭語意，不能共用同一套視覺語法。

### 4. Browser / JavaScript responsibility 必須保持精確

固定控制流：

```text
JavaScript 先登記 callback
  ↓
使用者之後 click
  ↓
Browser 收到 input
  ↓
Browser 決定 target
  ↓
Browser 建立 Event object
  ↓
Browser dispatch Event
  ↓
Browser 找到 listener registration
  ↓
Browser 呼叫 callback(event)
  ↓
JavaScript engine 執行 callback body
```

不得簡化成「JavaScript 抓 event」。

### 5. 名詞一致性

Lesson 2 後續統一使用「宿主應用」表示導入 Faro click tracking package 的實際 frontend application。

第一次可以寫：

> 宿主應用，例如領班助手

之後不要在同一堂課交替使用 `host`、`host application`、`Foreman Assistant` 等詞來指相同角色。

## Mobile-first correction

手機是主要閱讀情境之一。Learner 已實際回報教材在手機排版壞掉，因此這不是 cosmetic issue，而是教材可用性 requirement。

新增 shared `assets/mobile.css`，並由所有已載入的 `assets/theme.js` 自動載入，使既有 Lesson / Reference / Learning Map 不必逐頁重複 mobile patch。

Mobile safeguards：

- theme toggle 不再 fixed overlay 壓住手機標題。
- code block 保留水平 scroll，不把整個 body 撐寬。
- diagram flow 在窄螢幕改垂直排列。
- tables / callouts / quiz / figure 不超出 viewport。
- inline code、長 technical token 可在必要時 break。
- nested reference indentation 在手機縮減，避免可讀寬度被吃掉。

## Durable artifacts updated

2026-09-12 已同步：

- `lessons/0001-browser-click-foundation.html`
  - Browser-managed DOM object vs JavaScript reference
  - `HTMLButtonElement` 的精確角色
  - fixed example id + selector definition
  - explicit DOM parent/child tree
  - target / Event creator 分離
  - Capture / Target / Bubble 不重跑 target listener

- `lessons/0002-faro-click-instrumentation.html`
  - 固定使用 `daily-schedule-button`
  - 統一「宿主應用」名詞
  - `data-*` 是同一顆 DOM element 的 attribute
  - Browser parse / DOM creation 與 Faro extraction 邊界
  - Bubble diagram 不再暗示 target handler 重跑

- `reference/0001-dom-document-event-dispatch.html`
  - 重新整理為 cold-read reference
  - 明確區分 DOM tree 與 Event flow
  - `capture` registration option vs `event.eventPhase`
  - `target` vs `currentTarget`
  - `event.bubbles` vs `stopPropagation()`

- `reference/0002-callback-function.html`
  - callback 控制方向改成 browser dispatch → listener registration → callback
  - 明確說明 callback argument `event` 是 Browser 呼叫時傳入

- `assets/mobile.css`
  - shared phone layout safeguards

- `assets/theme.js`
  - 自動載入 shared mobile stylesheet

## Current ZPD after correction

這次修正代表教材本身已與 learner feedback 對齊，**不代表 learner 已 mastered**。

下一次 retrieval 仍應優先確認 learner 能自己重建：

1. DOM object 是誰建立／管理？JavaScript 拿到的是什麼？
2. 為什麼 `HTMLButtonElement` 不等於「HTML object」？
3. `id="daily-schedule-button"` 與 `#daily-schedule-button` 差在哪？
4. DOM tree 的縮排表示什麼？Event flow 箭頭又表示什麼？
5. click Event 是誰建立？target 是誰決定？
6. callback 是誰在什麼時候呼叫？
7. Bubble 為什麼不代表 target listener 會自動再跑一次？

通過這些 retrieval 後，才能把 Lesson 1 prerequisite 視為穩定，再把注意力放回 Lesson 2 的 Faro `ClickInstrumentation` 主線。
