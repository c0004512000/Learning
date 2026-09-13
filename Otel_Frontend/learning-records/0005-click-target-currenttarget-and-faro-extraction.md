# target / currentTarget 與 Faro click extraction 邊界

已建立的理解：`event.currentTarget` 代表目前正在執行 listener 的 DOM object；在 Faro ClickInstrumentation 的 document listener 中就是 `document`。`event.target` 則保留這次 click 最初命中的 element，所以即使 listener 掛在 `document`，ClickInstrumentation 仍必須從 `event.target` 開始，用 `closest()` 沿 ancestor chain 找 configured `data-*` attributes。

目前 Foreman Assistant 的 `trackAttributes` 已驗證只有 `data-link-name`。這個 attribute 由 Foreman developer 放在 template / DOM 上，Faro package 不會自行建立；package 只負責讀取並將命中的 `data-link-name` 轉成 click payload 的 `link_name`。User 與 device 資訊屬於其他 Faro metadata / instrumentation 路徑，不是 ClickInstrumentation 從 DOM 抽出的 click attributes。

這個理解之後可作為 Lesson 2 之後的基礎，不需要再把「listener 掛在哪裡」與「telemetry extraction 從哪裡開始」混在一起。