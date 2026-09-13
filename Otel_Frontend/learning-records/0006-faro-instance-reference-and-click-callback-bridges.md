# Faro instance reference 與 click callback 需要先建立兩個 bridge

已修正並建立的理解：`initializeFaro()` 只建立一個 Faro object；`registerFaroInstance(faro)` 不會再建立第二個 instance，而是把同一個 object 的 reference 從 `initFaro()` 的 local scope 保存到 function 外的 module-level `faroInstance`，讓 package 後續程式仍能取得它。`ClickInstrumentation` 是公司 package 自己實作的 object；它的 `initialize()` 向 Browser 建立 listener registration，而該 registration 保存的 callback reference 是 `handleClick`，之後 Browser dispatch click 時才實際呼叫 `handleClick(event)`。

這表示後續教材在進入 package lifecycle 或 instrumentation 抽象以前，必須先建立 `local variable → module-level reference → 同一個 object`，以及 `ClickInstrumentation → listener registration → handleClick callback → Browser dispatch 時呼叫` 這兩條因果關係，避免直接從 API 名稱跳到抽象設計。