# Runtime dynamic values 必須由 runtime evidence 證明

已修正的教學邊界：Foreman Assistant source 中的 `[attr.data-link-name]="item.subsystem"` 只能證明 dynamic value 會被綁到 `data-link-name`，不能證明目前部署中的任何特定 subsystem 名稱、畫面文字或 route/query string。

後續教材與 Lab 若需要具體 tracking value，必須先從當下 Browser live DOM 讀取；若 `closest('[data-link-name]')` 回傳 `null`，應把「目前 ancestor path 沒有命中」保留為有效 evidence，而不是用教材範例補值。Source model、deployed DOM 與 Network payload 必須分層驗證，再用同一個 runtime value 做 correlation。

這個 constraint 應套用到 Lesson 6 之後所有以 Foreman Assistant 真實 UI 為基礎的教學與 troubleshooting。