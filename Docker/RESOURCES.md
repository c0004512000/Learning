# Docker Fundamentals Resources

## Knowledge
- [Docker: What is a container?](https://docs.docker.com/learn/content/what-is-a-container/) — Image、Container、VM 對照；Session 01 主來源。
- [Docker Overview](https://docs.docker.com/get-started/docker-overview/) — Client、Daemon、Image、Container；Session 01、02、05。
- [Docker Running Containers](https://docs.docker.com/engine/containers/run/) — Process 與 Container 執行；Session 01、02。
- [Docker Desktop on Windows](https://docs.docker.com/desktop/setup/install/windows-install/) — WSL 2 / Linux 環境；跨平台疑問。
- [Linux namespaces(7)](https://man7.org/linux/man-pages/man7/namespaces.7.html) — 隔離的 PID、Mount、Network；Session 02。
- [Linux Kernel cgroup v2](https://docs.kernel.org/admin-guide/cgroup-v2.html) — CPU / Memory 控制；Session 02。
- [Dockerfile reference](https://docs.docker.com/reference/dockerfile/) — RUN、COPY、ADD、CMD、ENTRYPOINT；Session 03。
- [Docker Build Cache](https://docs.docker.com/build/cache/invalidation/) — Cache 失效；Session 03。
- [Docker Bridge network](https://docs.docker.com/engine/network/drivers/bridge/) — 容器網路；Session 04。
- [Docker Storage](https://docs.docker.com/engine/storage/) — Volume / Writable Layer；Session 04。
- [Kubernetes CRI](https://kubernetes.io/docs/concepts/containers/cri/) — kubelet 與 Runtime；Session 05。
- [Kubernetes Container Runtimes](https://kubernetes.io/docs/setup/production-environment/container-runtimes/) — 支援的 Runtime；Session 05。

## Wisdom
- 以可控制的測試環境執行 Docker CLI Lab，透過觀察驗證架構假設，避免把模擬資料誤認成實測。

## Gaps
- 尚未在使用者公司的測試環境執行 Docker CLI Lab，後續實作教材應保留環境與輸出證據。
