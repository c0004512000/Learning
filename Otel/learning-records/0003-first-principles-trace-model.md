---
Status: superseded by LR-0004
---

# First-principles trace model established

使用者能說明 Trace 相較於 Metric 所補足的證據：單一 request 的 operation timings、parent-child 因果關係，以及 Span attributes/events 的診斷脈絡；也能由 parent IDs 重建 Trace tree，並解釋 OTel 保留 instrumentation、只更換 exporter 或 destination 的解耦設計。這建立了 Trace 因果模型的可靠基礎；SDK 實作的準備度由 LR-0004 重新界定。

## Evidence

2026-08-08 更新版 Lesson 1 的三題 retrieval quiz 全數答對，第一題使用自身語言說明 Trace 的診斷價值。
