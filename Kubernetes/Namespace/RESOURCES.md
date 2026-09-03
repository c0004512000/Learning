# Linux Namespace Resources

## Knowledge — Primary / high-trust sources

- [Linux man-pages — namespaces(7)](https://man7.org/linux/man-pages/man7/namespaces.7.html)
  Namespace 的總入口。官方 Linux man-pages project 對 namespace 的定義、namespace types、`/proc/<pid>/ns` 與 `clone` / `setns` / `unshare` API 關係都在這裡。課程中的核心定義優先以此為準。

- [Linux man-pages — proc_pid_ns(5)](https://man7.org/linux/man-pages/man5/proc_pid_ns.5.html)
  說明 `/proc/<pid>/ns/` 每個 symbolic link 代表什麼，以及如何以 inode-like identifier 判斷兩個 process 是否位於同一 namespace。

- [Linux man-pages — unshare(1)](https://man7.org/linux/man-pages/man1/unshare.1.html)
  實驗最常用的 user-space 工具。可直接建立新的 namespace 並執行 command，適合把抽象概念變成可觀察結果。

- [Linux man-pages — nsenter(1)](https://man7.org/linux/man-pages/man1/nsenter.1.html)
  從另一個 process 的 namespace 進入其資源視圖，是日後 container / Kubernetes debugging 的重要工具。

- [Linux man-pages — lsns(8)](https://man7.org/linux/man-pages/man8/lsns.8.html)
  列出系統中的 namespace 與相關 process，適合建立 host 上 namespace inventory 的直覺。

- [Linux man-pages — clone(2)](https://man7.org/linux/man-pages/man2/clone.2.html)
  建立 process / thread 的核心 system call 之一；`CLONE_NEW*` flags 可在建立 child process 時建立新的 namespace。

- [Linux man-pages — unshare(2)](https://man7.org/linux/man-pages/man2/unshare.2.html)
  讓 calling process 不再與其他 process 共用特定 execution context；namespace 課程會用它理解「從既有共享狀態分出去」。

- [Linux man-pages — setns(2)](https://man7.org/linux/man-pages/man2/setns.2.html)
  讓 calling process 加入既有 namespace，是 `nsenter` 背後的重要 kernel API。

## Namespace-specific references

- [UTS namespaces(7)](https://man7.org/linux/man-pages/man7/uts_namespaces.7.html)
- [PID namespaces(7)](https://man7.org/linux/man-pages/man7/pid_namespaces.7.html)
- [Mount namespaces(7)](https://man7.org/linux/man-pages/man7/mount_namespaces.7.html)
- [Network namespaces(7)](https://man7.org/linux/man-pages/man7/network_namespaces.7.html)
- [IPC namespaces(7)](https://man7.org/linux/man-pages/man7/ipc_namespaces.7.html)
- [User namespaces(7)](https://man7.org/linux/man-pages/man7/user_namespaces.7.html)
- [Cgroup namespaces(7)](https://man7.org/linux/man-pages/man7/cgroup_namespaces.7.html)
- [Time namespaces(7)](https://man7.org/linux/man-pages/man7/time_namespaces.7.html)

## Container / Kubernetes bridge

- [Open Container Initiative Runtime Spec — Linux](https://github.com/opencontainers/runtime-spec/blob/main/config-linux.md)
  OCI runtime 對 Linux namespaces 的標準化設定方式。等 Linux 原理建立後，用來連到 runc / container runtime，而不是反過來用 runtime 名詞定義 namespace。

- [Kubernetes — Pods](https://kubernetes.io/docs/concepts/workloads/pods/)
  Kubernetes 官方 Pod 模型。後段課程會用它理解 Pod shared context、container isolation 與 Linux namespace 的關係。

- [Kubernetes — Share Process Namespace between Containers in a Pod](https://kubernetes.io/docs/tasks/configure-pod-container/share-process-namespace/)
  官方實驗頁，適合驗證 Pod 內 PID namespace sharing 對 process visibility 的實際影響。

## Wisdom / real-world practice

- [Linux man-pages project](https://www.kernel.org/doc/man-pages/)
  遇到 namespace 行為疑問時，優先回到對應 man page 與 kernel user-space API 文件，而不是先採信部落格的簡化說法。

- [Kubernetes SIG Node](https://github.com/kubernetes/community/tree/master/sig-node)
  容器執行、CRI、Pod/node runtime 行為的社群與設計討論入口。進入 container runtime / Kubernetes implementation 深水區時再使用。

## Gaps

- 目前不預先收集大量二手 container 教學，避免在 Linux 基礎尚未建立前被 Docker / Kubernetes 術語反向干擾。
- 未來進入 rootless container、user namespace mapping、capabilities 時，再補 kernel / OCI / runtime 的針對性 primary sources。
