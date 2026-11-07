# Teaching Notes（非 Learning Records）

## 穩定偏好
- 使用繁體中文（台灣用語）、第一性原理、因果鏈。先從看得到的行為建立必要概念，之後才命名。
- 偏好手機可讀、乾淨、深色與青綠重點的流程圖；CSS 可獨立設計，但教學規則仍依 canonical Learning-from-docs。
- 公開教材使用合成情境，不公開公司私有 repo／網路／Credential。
- 對實驗性操作需區分「預期」與「實際觀察」；沒有證據不宣稱已驗證。

## 概念缺口 → 教學約束（尚未證明理解）
### Analysis Report vs Compute Engine（2026-11-07）
- 過去的說明直接跳到「Compute Engine 處理報告」，缺少「Report 是什麼」以及 Scanner／CE 責任邊界。
- Lesson 02 在解釋非同步處理前先建立 Scanner 產出的結構化資料與後續彙總的差別。
- 並未取得學習者的正確作答，因此不能推斷該概念已掌握。

### Trigger vs PR analysis、Project（2026-11-07）
- GitHub `pull_request` 可以啟動 Runner，不代表 SonarQube 免費版支援 PR 獨立分析；教材須顯示 trigger → checkout → scanner → server 支援維度的因果路徑。
- Project 應在第一次被用來解釋其他概念前，以 Repo → Project → Project Key 作最小橋接；Phase 03 Lesson 05 再深入。
- 使用者只是提出問題，沒有證明能解釋這兩個區別；不記為 Learning Record。

## 進度與後續教學
- 7 階段、14 堂主線規劃；截至 2026-11-07 已寫 Lesson 01–04，無任何一堂已完成理解或實作驗收。
- 最近的研讀焦點在 Phase 02／Lesson 03；這代表學習位置，不代表 L01／L02 已掌握。
- L03 / L04 之後視觀念驗收結果補最小 bridge，不以往返對話用字直接當 Lesson 標題。
