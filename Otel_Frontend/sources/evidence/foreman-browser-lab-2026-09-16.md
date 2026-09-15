# Foreman Assistant Browser DevTools lab observation — 2026-09-16

## Question / scope

記錄一次由 learner 在 Stage Foreman Assistant 實際操作產生的 Browser DevTools runtime evidence，用於 Lesson 6 的 Elements / Console / Event Listener / Network 教學。這份 evidence 只記錄畫面可直接證明的 runtime 事實，不把未驗證的 business expectation 當成結論。

## Verification metadata

- `verified_at`: 2026-09-16 (UTC+8)
- page observed: `https://pek8s-staging.garmin.com/foreman-assistant/#/main`
- browser: Edge 152 系列 DevTools（由 payload meta 可見 Edge 152）
- source of evidence: learner-provided DevTools screenshots in the learning session

## DOM / Console observation

對 learner 實際選中的 UI：

- `$0.tagName` 回傳 `SPAN`。
- `$0.closest('[data-link-name]')` 命中 ancestor `<p-button ... data-link-name="EfficiencyAbnormalReport" ...>`。
- `$0.closest('[data-link-name]')?.getAttribute('data-link-name')` 回傳 `EfficiencyAbnormalReport`。

因此這次 runtime 可以直接證明：

```text
SPAN (selected node)
  │ closest('[data-link-name]')
  ▼
p-button[data-link-name="EfficiencyAbnormalReport"]
```

這與既有 source evidence 的 PrimeNG host/inner-node ancestor model 相容，但此值只代表本次 runtime observation，不代表所有 deployment 永遠存在相同 subsystem 名稱。

## Listener observation

`getEventListeners(document).click` 顯示一個 click listener registration，主要可讀欄位為：

- array `length: 1`
- `type: "click"`
- `useCapture: false`
- `once: false`
- `passive: false`
- `listener.name: "globalZoneAwareCallback"`
- `[[FunctionLocation]]: zone.js:1201`

這只能直接證明目前 `document` 上 DevTools 看得到一個 click listener registration，而且目前露出的 callback 是 Zone.js wrapper。它**不能單獨證明**該 wrapper 內最後執行的一定是 Faro `handleClick`。若要拿 callback execution evidence，需要 Event Listener Breakpoint / call stack 進一步確認。

## Network observation

以 `alloy` filter 觀察到：

- 一筆 `OPTIONS` preflight：
  - Request URL: `https://shixpa-peproxy00.garmin.com/alloy`
  - Status: `204 No Content`
  - Type: `preflight`
  - response headers 可見 `Access-Control-Allow-Methods: POST`
  - response headers 可見 `Access-Control-Allow-Headers: content-type,x-faro-session-id`
  - response headers 可見 `Access-Control-Allow-Origin: *`
  - DevTools Response 顯示 no content；對 204 preflight 而言沒有 response body 是正常現象，不應解讀成 request failure。

- 多筆 `fetch` POST：
  - Request URL: `https://shixpa-peproxy00.garmin.com/alloy`
  - Status: `202 Accepted`
  - Type: `fetch`
  - 至少一筆 POST Payload 包含：
    - `events[0].name = "click"`
    - `events[0].domain = "browser"`
    - `events[0].attributes.link_name = "EfficiencyAbnormalReport"`
  - meta 可見 app `foreman-assistant`、version `1.0.15-dev`、environment `tw-prod`、device type `desktop`、page URL 為 Stage Foreman Assistant。

PII 欄位（例如實際 user id / username）不記錄於此 evidence。

## Runtime correlation proven by this observation

這次可以建立以下 runtime evidence chain：

```text
live DOM
  data-link-name="EfficiencyAbnormalReport"
      │
      │ ClickInstrumentation contract extracts data-link-name
      ▼
POST /alloy payload
  events[].name = "click"
  events[].attributes.link_name = "EfficiencyAbnormalReport"
      │
      ▼
HTTP response
  202 Accepted
```

這足以證明本次操作至少有一筆可與該 tracked click 關聯的 Faro request 被 receiver 接受到 HTTP boundary；**不能單獨證明** Alloy 後續到 Collector / storage 全部成功。

## Stage page vs telemetry receiver/environment

本次 page URL 是 `pek8s-staging.garmin.com`，但實際 Faro request URL 是 `shixpa-peproxy00.garmin.com/alloy`，payload meta environment 為 `tw-prod`。

這個 runtime observation與既有 `foreman-integration.md` 中 `src/main.ts` 傳入 `environment: 'tw-prod'` 的 source evidence一致。是否符合 deployment policy / business expectation 需要另一個明確 requirement 才能判定；目前只記錄為「Stage page 實際使用 tw-prod Faro environment / prod receiver」。

## Teaching implications

- Lesson 6 不應使用抽象 placeholder `TRACKING_VALUE`；應直接說「剛才從 live DOM 讀到的 `data-link-name` 值」。
- Network lab 必須先教會 learner 分辨 `preflight` 與實際 `fetch/POST`，再要求看 Headers / Payload / Response。
- `getEventListeners()` 的大型物件不應要求 learner 全部理解；只保留與 listener registration 判斷有關的欄位。
- Event Listener Breakpoint 應成為 Lab 的具體步驟，而不是一句延伸建議。
