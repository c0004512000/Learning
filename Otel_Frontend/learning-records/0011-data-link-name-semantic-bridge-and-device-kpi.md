# data-link-name 的 semantic bridge 與 Device KPI 邊界

本次建立的關鍵 mental model：Foreman 原本就有 `subsystem` 這種 application-level 功能識別值；`data-link-name` 不是導入前就存在的 DOM attribute，而是在 Faro integration 時新增，用來把既有的 `subsystem` identifier 投影到 DOM。ClickInstrumentation 再從 DOM 讀取它並轉成 `link_name`。因此需要把三層分開：application state (`item.subsystem`) → DOM attribute (`data-link-name`) → telemetry field (`link_name`)。

`data-link-name` 也不能理解成 HTML hyperlink name 或業界固定 convention。Foreman source inventory 顯示主要標記位置是 Main subsystem tile template 與五個 Toolbar 功能；大量其他 `p-button`、native `button` 與 `<a>` 沒有這個 attribute。這使目前 implementation 更接近 selective feature-entry / navigation tracking，而不是完整 clickstream tracking。

另一個重要修正是 Device 與 Click 不走同一條 instrumentation。`device.type` 由 device detector 維護並透過 Faro meta provider 提供；`link_name` 則由 ClickInstrumentation 從 DOM extraction 產生。Device detection 並不是點到 `data-link-name` 才開始執行。

對原始 tablet / desktop adoption 需求，必須先定義 KPI 分母。如果用有 `data-link-name` 的 subsystem entry events 當 observation point，可以回答「被追蹤的主要功能入口事件中，tablet / desktop 的分布」；不能直接擴大成「所有 Foreman sessions / users / actions 的裝置分布」。同一個 user 在不同 browser / device 上會有各自 runtime device state；真正可能漏掉的是後續沒有產生被選作 KPI signal 的 telemetry，而不是 device type 被第一次 click 永久鎖死。

後續教材限制：

- Lesson 2 應先建立 `subsystem → data-link-name → link_name` 的三層責任邊界，再談 selective tracking coverage。
- Lesson 4 應把 device meta 與 click signal 分開，並避免把 `device.type` 描述成永久硬體分類；現行規則較接近最近一次可辨識輸入型態。
- DevTools 解讀 `closest('[data-link-name]')?.getAttribute('data-link-name')` 時，要先說明整句是 JavaScript，但 `closest()` 的字串參數採 CSS selector 語法；`[data-link-name]` 是 selector，`getAttribute('data-link-name')` 的參數則是 attribute name。
- Durable lesson 不應重演本次問答歷史；應以 blank-slate 方式從上述 concept dependency 重新教。

Source basis：`sources/evidence/data-link-name-investigation-2026-09-17.md`、`sources/evidence/data-link-name-clickable-inventory-2026-09-17.md`、`sources/evidence/faro-click-tracking.md`。完整 learner-facing bridge 見 `reference/0007-data-link-name-device-adoption.html`。
