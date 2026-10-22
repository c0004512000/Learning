# Application 語意、DOM 標記與 Device KPI 的邊界

既有互動暴露的教學需求是先區分 application subsystem、DOM data-link-name 與 telemetry link_name，再討論追蹤 coverage；device classification 與 click extraction 是不同生命週期，不應以第一次 click 解釋跨裝置狀態。Lesson 2／4 與 Reference 0009 因此以三層資料來源及 signal／context 分工呈現；KPI 需先定義分母，不把入口事件分布擴大成全部 sessions、users 或操作。

此紀錄整合 PR #24 的 diagnostic findings；不把教材新增或重述當成 learner 已通過 retrieval。主線位置與尚待驗證的 prerequisite 不變。Source basis：`sources/evidence/data-link-name-investigation-2026-09-17.md`、`sources/evidence/data-link-name-clickable-inventory-2026-09-17.md`、`sources/evidence/faro-click-tracking.md`；可重用教學見 `reference/0009-data-link-name-device-adoption.html`。
