# Docker Fundamentals — Resources

## Knowledge

- [Docker: What is Docker?](https://docs.docker.com/get-started/docker-overview) — CLI / Daemon、Image、Container 及 Client/Server Architecture；用於 Session 01–02、05。
- [Docker: What is a Container?](https://docs.docker.com/learn/content/what-is-a-container/) — Image / Container、唯讀層與可寫層、VM 對比；用於 Session 01–03。
- [Docker Desktop on Windows](https://docs.docker.com/desktop/setup/install/windows-install/) — WSL 2 / Hyper-V 等 Linux Container 執行環境；用於區分 Host Kernel 的範圍。
- [Linux Manual: namespaces(7)](https://man7.org/linux/man-pages/man7/namespaces.7.html) — Namespace 的隔離機制與類型；用於 Session 02。
- [Linux Kernel: cgroup v2](https://docs.kernel.org/admin-guide/cgroup-v2.html) — CPU、Memory 等控制器；用於 Session 02。
- [Docker: Dockerfile reference](https://docs.docker.com/reference/dockerfile/) — Instruction 語意與差異；用於 Session 03。
- [Docker: Cache invalidation](https://docs.docker.com/build/cache/invalidation/) — COPY / ADD 與 RUN 的 Cache 邊界；用於 Session 03。
- [Docker: Optimize Cache](https://docs.docker.com/build/cache/optimize/) — 依相依關係排序、縮小變更影響；用於 Session 03。
- [Docker: Bridge network driver](https://docs.docker.com/engine/network/drivers/bridge/) — User-defined Bridge 隔離、同網路可連線；用於 Session 04。
- [Docker: Storage](https://docs.docker.com/engine/storage/) — Writable Layer、Mount、Volume；用於 Session 04。
- [Kubernetes: CRI](https://kubernetes.io/docs/concepts/containers/cri/) — kubelet 與 Container Runtime 介面；用於 Session 05。
- [Kubernetes: Container Runtimes](https://kubernetes.io/docs/setup/production-environment/container-runtimes/) — containerd、CRI-O 與 Docker Engine adapter；用於 Session 05。

## Wisdom
- 正式練習以講者現場可控制的測試用 Linux Docker Engine 為主；保留每個 Demo 的期望狀態與實際輸出，不以模擬輸出當驗證。

## Gaps
- Docker CLI / Network / Volume 的現場實驗尚未於本教材環境實際執行；後續 Lab 應在測試環境產生觀察證據。
