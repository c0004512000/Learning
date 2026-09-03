# Linux Namespace Learning Workspace

這個目錄是 Linux Namespace 的持續學習 workspace，依 Matt Pocock `teach` 方法維護。

## Mission

從 Linux 基礎開始，理解：

`program → process → kernel → namespace → container → Kubernetes Pod`

不把 namespace 當成需要背誦的 Linux 功能，而是從「同一顆 kernel 如何讓不同 process 看見不同世界」逐層推導。

## 目前教材

- [MISSION.md](./MISSION.md) — 為什麼學、成功標準、限制
- [RESOURCES.md](./RESOURCES.md) — 主要來源與延伸資源
- [NOTES.md](./NOTES.md) — 教學偏好與課程狀態
- [GLOSSARY.md](./GLOSSARY.md) — 已正式建立的核心名詞
- [Lesson 1 — Namespace 為什麼存在？](./lessons/0001-why-linux-namespaces-exist.html)
- [Reference — Linux Namespace 核心模型](./reference/linux-namespace-core-model.html)
- [index.html](./index.html) — 課程入口與學習地圖

## 教學原則

- 不預設 Linux 基礎。
- 一次只建立一個必要概念。
- 先回答 why，再進入 what / how。
- 每個 lesson 只追求一個可驗證的 tangible win。
- 後續 lesson 依實際理解與追問調整，不預先把整套課程寫死。
