# Trace 證據、runtime 邊界與 queue 計數單位

兩份 2026-10-22 匯出對話顯示，後續教學需先分清「資料指出誰」與「資料包含什麼」，再區分 span 的 CLIENT／SERVER 角色與產生它的 Browser／backend runtime；parent equality 要指到實際欄位，不能只由顏色或兩個 SpanID 推論。Batching 則需要先建立 operation、span、TransportItem 與 POST 的不同單位，才引入兩層 queue 與 timer。

Lesson 5／8 與 Reference 0010／0011 已依此安排具體例子、反例與 retrieval；主線維持 Lesson 3，未將來源對話、教材產出或離線檢查視為 learner mastered。來源限定與核查見 `sources/evidence/faro-conversation-verification-2026-10-22.md`。
