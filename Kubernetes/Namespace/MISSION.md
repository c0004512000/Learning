# Mission: Linux Namespace

## Why

從 Linux 底層真正理解 container 與 Kubernetes 的隔離模型。目標不是只會使用 Docker、Kubernetes 或 `kubectl`，而是能回答：一個 container 為什麼看起來像獨立系統、它實際和 host 共用了什麼、Linux kernel 如何製造不同的資源視圖，以及 Kubernetes Pod 最後如何建立在這些機制之上。

## Success looks like

- 能從零區分 program、process、Linux kernel、user space，以及 `/proc` 在觀察 process 時扮演的角色。
- 能用第一性原理解釋 namespace：它不是 VM，也不是另一顆 kernel，而是 kernel 對特定全域資源提供的隔離視圖。
- 能使用 `/proc/<pid>/ns`、`lsns`、`readlink` 判斷 process 的 namespace membership。
- 能理解並實驗主要 namespace 類型：UTS、PID、Mount、Network、IPC、User、Cgroup、Time。
- 能理解 `clone(2)`、`unshare(2)`、`setns(2)` 與 user-space 工具 `unshare`、`nsenter` 在 namespace 建立／加入上的角色。
- 能清楚區分 namespace 與 cgroups：前者主要控制「看見什麼」，後者主要控制／計量「可以使用多少資源」，並理解 container 需要多個 Linux 機制共同組合。
- 能從 Linux namespace 回推 container runtime 的基本隔離模型，而不是把 container 當成黑盒。
- 能解釋 Kubernetes Pod 中哪些 Linux namespace 可能由 containers 共用、哪些仍可隔離，以及這對 networking、process visibility 與 debugging 的影響。
- 遇到 Kubernetes container 問題時，能從 Pod/container 一路追到 host 上的 process 與 namespace，建立可操作的 debugging 心智模型。

## Constraints

- 不預設任何 Linux 基礎，包括 process / PID、`/proc`、mount、filesystem、network interface、kernel space / user space。
- 必要前置概念要在真正需要時才建立；不得用一串尚未解釋的 Linux 名詞去定義另一個新名詞。
- 以第一性原理式因果推導：先建立「為什麼需要這個機制」，再介紹名稱、指令與 API。
- 實驗以 Linux / WSL2 Ubuntu 可執行的 Bash 指令為主；需要 root 或 capability 的步驟要明確標示。
- 課程使用繁體中文；Linux、kernel、process、namespace、syscall 等專有名詞保留英文原文並精確定義。
- 每個 lesson 短而聚焦，只解決一個主要問題，並提供立即可驗證的 feedback loop。
- 描述 process、kernel、namespace、container、Pod 的關係時，優先使用結構圖、流程圖或對照圖，不只給文字定義。
- 追問如果修正了心智模型、順序或教材內容，必須回填 workspace；但不要把每句聊天變成 activity log。

## Out of scope（目前暫緩）

- Linux kernel source code 級別的 namespace implementation 細節。
- container runtime（containerd / runc / CRI）完整原始碼導讀。
- Kubernetes security hardening、SELinux、AppArmor、seccomp 的完整課程；只有在 namespace 邊界需要比較時才帶入。
- eBPF、CNI plugin internals 等進階主題；等 Namespace / container 基礎穩固後再建立獨立主題。
