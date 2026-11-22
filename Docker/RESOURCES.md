# Docker Fundamentals — Sources

## Primary official sources

### Session 01 — What Is a Container & Docker?
- [Docker Learn: What is a container?](https://docs.docker.com/learn/content/what-is-a-container/) — Container、Image、隔離 Process、Linux VM 邊界。
- [Docker Engine](https://docs.docker.com/engine/) — Docker Client／Daemon／Image／Container。
- [Docker Learn: Run your first container](https://docs.docker.com/learn/content/run-your-first-container/) — docker run、docker exec、同一 Image 建立多個 Container。
- [Docker container run CLI reference](https://docs.docker.com/reference/cli/docker/container/run/) — docker run 的參數與 Port Mapping。

### Session 02 — Why Containerization?
- [Docker Learn: What is a container?](https://docs.docker.com/learn/content/what-is-a-container/) — Runtime / Dependencies 差異與 Container 的封裝價值。
- [Docker: Share your image](https://docs.docker.com/learn/content/share-your-image-on-docker-hub/) — Registry、Push/Pull、Tag 的可變性。
- [Docker: Pull image by digest](https://docs.docker.com/reference/cli/docker/image/pull/) — Digest 能釘選特定 Image 內容。
- [Docker: Building best practices](https://docs.docker.com/build/building/best-practices/) — Base Image、Tag 與供應鏈考量。
- [Session 02 source evidence](sources/evidence/2026-11-22-session-02.md) — 本堂經核對的原理、來源與適用邊界。

### Session 03 — How Containers Work
- [Linux namespaces(7)](https://man7.org/linux/man-pages/man7/namespaces.7.html) — PID、Mount、Network Namespace。
- [Linux Kernel cgroup v2](https://docs.kernel.org/admin-guide/cgroup-v2.html) — CPU、Memory 等資源管理。
- [Docker Desktop on Windows](https://docs.docker.com/desktop/setup/install/windows-install/) — Windows Docker Desktop 的 Linux VM 邊界。

### Session 04 — Dockerfile & Image Layers
- [Dockerfile reference](https://docs.docker.com/reference/dockerfile/) — FROM、RUN、COPY、ADD、ENV 等指令。
- [Docker Learn: Image layers and build cache](https://docs.docker.com/learn/content/how-image-layers-and-the-build-cache-work/) — Image 層與 Writable Layer。

### Session 05 — Docker Build Cache & Best Practices
- [Docker Build Cache](https://docs.docker.com/build/cache/invalidation/) — Cache 失效條件。
- [Dockerfile reference](https://docs.docker.com/reference/dockerfile/) — CMD、ENTRYPOINT、ADD、COPY、Multi-stage。

### Session 06 — Container Lifecycle & Storage
- [Docker Running Containers](https://docs.docker.com/engine/containers/run/) — Runtime 與主要 Process。
- [Docker Storage](https://docs.docker.com/engine/storage/) — Volume、Bind Mount、Writable Layer。

### Session 07 — Docker Networking
- [Docker Networking overview](https://docs.docker.com/engine/network/) — Network Driver、Container 連線。
- [Docker Bridge network](https://docs.docker.com/engine/network/drivers/bridge/) — User-defined Bridge、DNS 與不同 Network 的隔離。
- [Docker Port publishing](https://docs.docker.com/engine/network/port-publishing/) — -p、Loopback 與外部開放。

### Session 08 — From Docker to Kubernetes
- [Docker Engine](https://docs.docker.com/engine/) — Docker CLI、dockerd。
- [Kubernetes CRI](https://kubernetes.io/docs/concepts/containers/cri/) — kubelet、CRI。
- [Kubernetes Container Runtimes](https://kubernetes.io/docs/setup/production-environment/container-runtimes/) — Container Runtime 與 Kubernetes。

## Evidence rules
- 技術資料以官方文件或明確驗證為準。由範例預測的行為不得冒充在公司環境實測成功。
- 內部分享的 Lab 應在可控測試機執行，記錄預期／實際觀察與差異。
- 每堂 Lesson 將對應的官方資料直接附在教材末尾，並透過 Course Map 保留來源映射。
