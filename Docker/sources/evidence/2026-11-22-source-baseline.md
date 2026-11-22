# Docker learning — verified sources and boundaries
Date: 2026-11-22 Asia/Taipei

## Official references and their scope
1. https://docs.docker.com/learn/content/what-is-a-container/ — Container、Image 與 VM 的核心差異。Session 01。
2. https://docs.docker.com/get-started/docker-overview/ — Docker Client／Daemon，Image、Container。Session 01／02／05。
3. https://docs.docker.com/engine/containers/run/ — 在 Container 執行 Process。Session 01／02。
4. https://docs.docker.com/desktop/setup/install/windows-install/ — Windows Linux Containers 與 WSL 2 / Linux kernel；邊界說明。
5. https://man7.org/linux/man-pages/man7/namespaces.7.html — Linux Namespace、資源隔離。Session 02。
6. https://docs.kernel.org/admin-guide/cgroup-v2.html — cgroup 資源控制。Session 02。
7. https://docs.docker.com/reference/dockerfile/ — Dockerfile 指令。Session 03。
8. https://docs.docker.com/build/cache/invalidation/ — Build Cache。Session 03。
9. https://docs.docker.com/engine/network/drivers/bridge/ — Bridge Network。Session 04。
10. https://docs.docker.com/engine/storage/ — Volume / Writable Layer。Session 04。
11. https://kubernetes.io/docs/concepts/containers/cri/ — CRI。Session 05。
12. https://kubernetes.io/docs/setup/production-environment/container-runtimes/ — K8s Runtime。Session 05。

## Explanation boundaries
- VM 的 Guest Kernel 與 Linux Container 共用 Host Kernel 是架構核心；不同 Hypervisor 的 I/O 實作並不相同。
- 不是每個 System Call 都造成 VM exit，read() 可被 Kernel 快取滿足。
- Docker Desktop 可能以虛擬機提供 Linux kernel；Linux Container 不會因此改為使用 Windows/macOS Kernel。
- Image 是程式與大量執行依賴的封裝，不保證外部資料、設定、硬體架構相同。
- 任何公司環境的 Docker CLI 輸出都尚未實測，不能宣稱已驗證。
- 把完整技術課綱規劃在 Course Map；第一堂只逐步教到 Kernel 邊界，其他名詞留待未來 Lesson。
