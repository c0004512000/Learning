# Foreman Assistant host integration

## Question / scope

確認 Foreman Assistant 如何初始化 Faro、提供 user/device/click 設定，以及目前 DOM/component architecture 對 `closest()` click tracking 的實際邊界。現況與建議分開記錄。

## Verification metadata

- `verified_at`: 2026-09-12
- source/system: `garmin-tw-mfg-eng/XD-Foreman-Assistant`
- ref: `main`
- commit: `4e032babef7aa30e5d13d7a506abe208945a5dee`
- package: `@sre2/faro-click-tracking ^1.0.0`、`primeng ^18.0.2`（lockfile resolves 18.0.2）
- runtime read-only observations: Kubernetes `tw-stage/mes1-frontend` and `tw-prod/mes1-frontend`, 2026-09-12

## Verified current state

### Initialisation and package configuration

- `foreman-assistant/src/main.ts:11-34` 在 `bootstrapApplication()` 前呼叫一次 `initFaro()`。
- 傳入 `environment: 'tw-prod'`、app name `foreman-assistant`、version `environment.appVersion`。
- `trackAttributes` 只有 `['data-link-name']`；`enableDeviceTypeDetection: true`。
- `getUser()` 每次被 package callback 呼叫時讀 `localStorage` key `ngx-webstorage|foreman-assistant-employee`；無 employee 回傳 `null`，有值回傳 `{ id: employee.empID, username: employee.ename }`。source 沒有宣稱 cookie、遠端 user API 或持久化 Faro cache。

### Marked DOM interactions

- `src/app/layout/main/main.component.html:42-84` 的系統入口以 `[attr.data-link-name]="item.subsystem"` 放在 `<p-button>` host 上。
- `src/app/shared/toolbar/toolbar.component.html:81-145` 有五個 static `data-link-name` 值（`UserGuide.UserGuide`、`ReferenceDocument.SDS`、`ReferenceDocument.AI`、`ReferenceDocument.ForemanManual`、`Contact.ContactAdministrator`）。
- `src/app/shared/line-selector/line-selector.component.html:39` 的 `data-red-light-count` 不是 package 設定的 tracked name，因此不會成為 click payload。
- 以 HEAD 的 25 個 HTML template 做 bounded scan：48 個 `<p-button>`、2 個 native `<button>`、2 個 `<a>`、7 個 `data-*` references（上述五個 static link、一個 dynamic link、一個 red-light counter）。這是 markup count，不是「已覆蓋的 business interaction 數量」。

### Component architecture and render boundary

- 在 `src/app` 未找到 app 自有的通用 `Button` 或 `Link` wrapper；可辨識的 shared components 是 toolbar、line-selector、table-settings、field-components 等功能元件。大多數互動直接在 feature templates 使用 PrimeNG `p-button` 或少量 native elements。
- PrimeNG `18.0.2` source（tag commit `aaef4d94aabcbdbc58e0d523a52f23ae05660810`）的 `packages/primeng/src/button/button.ts` 由 `<p-button>` host render 內部 native `<button>`。Foreman 的 `data-link-name` 因此位於 custom-element host，而不是直接位於 inner button；inner button 仍以 ancestor 路徑連到 host，package 的 `element.closest('[data-link-name]')` 可找到它。
- 已有 source 能證明 PrimeNG 這個 render path；沒有 source 證明所有未來 wrapper、portal 或 overlay 都保持同一個 DOM ancestor 關係。

### Runtime deployment

- `tw-stage/mes1-frontend` deployment `foreman-assistant` image: `linxpa-pestgharbor00.garmin.com/kube/foreman.assistant:1.0.15`。
- `tw-prod/mes1-frontend` deployment `foreman-assistant` image: `linxpa-peprdharbor00.garmin.com/kube/foreman.assistant:1.0.8`。
- 兩個 deployment 的 runtime `OTLP_COLLECTOR_URL` 都是 cluster-local `opentelemetry-collector...:4317`；這只記錄目前 deployment env，不把 source 的 `tw-prod` 初始化字串改寫成 stage/prod runtime 行為。

## Evidence

- Host init: `src/main.ts:4-34`。
- Marked interactions: `src/app/layout/main/main.component.html:42-84`、`src/app/shared/toolbar/toolbar.component.html:81-145`、`src/app/shared/line-selector/line-selector.component.html:39`。
- Dependency versions: `package.json:24-31`、`package-lock.json` entry for `@sre2/faro-click-tracking` and `primeng`.
- Shared-component scan: bounded `rg` over `src/**/*.ts` and `src/**/*.html` at commit above; no generic Button/Link component was found.
- PrimeNG source: `https://github.com/primefaces/primeng/blob/aaef4d94aabcbdbc58e0d523a52f23ae05660810/packages/primeng/src/button/button.ts`.
- Runtime resources: Kubernetes deployment specs in namespaces `mes1-frontend` (read-only query at verification timestamp); credential values intentionally omitted.
- Foreman PR #21: `https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/pull/21`，merge commit `f4a3688d3beed8f8448b78583cd93985884cff23`（init-before-bootstrap, marked templates, user callback, device opt-in and test plan）。

## Possible integration recommendation (not current state)

- 若需要提高 coverage，應在真正 clickable DOM node 或可證實為 ancestor 的 host 加上 `data-*`，並以 representative browser click/DevTools evidence 驗證，而不是把所有 `<p-button>` 數量當成 coverage。
- 建議對自製 wrapper、overlay/portal、以及未標記 native button 另做 component-level review；目前 evidence 不支持「Foreman 現在有 shared Button/Link 會丟失 attributes」這個結論。

## Unknown / not proven

- 沒有 app-level shared generic Button/Link 的 bounded scan 結果之外，尚未證明每一個 business interaction 是否都走上述 templates；markup count 不能回答此問題。
- 尚未以瀏覽器逐一點擊驗證所有 marked/unmarked controls 的實際 event payload；PrimeNG ancestor 路徑由 source 可證實，但實際 bundle/runtime delivery 仍是另一層 evidence。
- `OTLP_COLLECTOR_URL` 的存在不能證明 Foreman 當前每一筆 Faro event 已成功抵達 Collector。

## Mission / Course relevance

- 支援 Lesson 2 的 host marking、ancestor placement 與「data-* 是 validation requirement」模型。
- 支援 Lesson 3/4 的 `initFaro`、user callback、device opt-in 與 environment boundary。
- 支援 Lesson 6/10 的 coverage audit、DevTools payload 與 OpenSearch/Loki field 驗證。
