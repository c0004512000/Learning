# Notes

- 使用者要從零開始學 Linux Namespace，且明確要求 Linux 基礎也不能預設。
- Mission 最終落點是能從 Linux 底層理解 container 與 Kubernetes Pod 的隔離模型，而不是只記指令。
- 使用者是 SRE，因此後續可加入 namespace debugging 的判讀與實驗，但 troubleshooting 必須建立在已理解的底層模型上，不能取代基礎推導。
- 課程語言固定繁體中文；專有名詞保留英文原文並精確定義。
- 實驗以 Bash / Linux / WSL2 Ubuntu 為主要環境。
- 使用者偏好第一性原理：從已理解的具體事實逐步問「要讓這件事成立，下一個必要條件是什麼？」一次只引入一個新概念。
- 不得用「container 就是 namespace」這類過度簡化句當起點。Container 是多個 Linux isolation / resource-control 機制的組合，namespace 只負責其中一部分。
- 新 namespace 類型不能只用表格背誦。每一類都應先建立它要隔離的「原本是全域的東西」以及不隔離會造成的問題，再進指令與 API。
- Lesson 優先使用圖解表示 process → kernel → namespace view 的關係；每種箭頭要有明確語義。
- 每個 lesson 應短而聚焦，提供一個可驗證的 tangible win；對話中的追問與修正如果改變理解或教材，應同步回填 lesson / reference / learning-record。
- `GLOSSARY.md` 只收錄已經正式建立、使用者應可重新解釋的名詞；不要把未教授的名詞提前塞進 glossary。
- 第一課只建立 program / process / kernel / namespace / namespace membership / `/proc/<pid>/ns` 的核心模型；UTS/PID/NET/MNT 等各類型留待後續逐一推導。

## Adaptive learning path（暫定，不視為固定章節）

1. Namespace 為什麼存在：同一顆 kernel 如何給不同 process 不同視圖。
2. 第一個實驗：用 UTS namespace 看見「同 kernel、不同 hostname」。
3. Process / PID 基礎與 PID namespace。
4. Filesystem / mount 基礎與 Mount namespace。
5. Linux networking 基礎與 Network namespace。
6. UID / privilege / capability 基礎與 User namespace。
7. IPC、Cgroup、Time namespace；以及 namespace vs cgroups。
8. 把多種 namespace 組合成最小 container 心智模型。
9. OCI / runc / container runtime 如何要求 kernel 建立這些隔離。
10. Kubernetes Pod 的 namespace sharing 與 container boundary。
11. SRE debugging：從 Pod / container 找到 host process，判讀並進入 namespace。

順序會依使用者追問與 learning records 調整。
