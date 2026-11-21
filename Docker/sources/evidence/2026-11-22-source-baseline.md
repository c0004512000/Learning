# Docker Fundamentals — Verified source baseline
Checked: 2026-11-22 (Asia/Taipei)

## E1 — Container / VM Kernel boundary
- Docker Container learning: https://docs.docker.com/learn/content/what-is-a-container/
- Docker Engine overview: https://docs.docker.com/get-started/docker-overview
- 概念：Linux Container 共用 Linux Host Kernel；VM 具獨立 Guest Kernel 與虛擬硬體。Container 可以自帶 Userspace 檔案但不是自帶運行中的 Kernel。
- 邊界：不同 Hypervisor 實作的 I/O 快取與裝置路徑不同；教學圖僅為概念流程。

## E2 — Docker Desktop / Linux kernel environment
- https://docs.docker.com/desktop/setup/install/windows-install/
- https://docs.docker.com/desktop/setup/install/linux/
- Windows / macOS 等環境執行 Linux Container，可透過 VM / WSL 2 等後端提供 Linux Kernel。不能宣稱 Docker 永遠不使用 VM。

## E3 — Linux isolation
- https://man7.org/linux/man-pages/man7/namespaces.7.html
- https://docs.kernel.org/admin-guide/cgroup-v2.html
- Namespace 決定部分資源視角隔離；cgroups 控制資源分配與限制。這不是足以定義安全 Container 的全部機制。

## E4 — Image, Dockerfile, cache
- https://docs.docker.com/learn/content/how-image-layers-and-the-build-cache-work/
- https://docs.docker.com/build/cache/invalidation/
- https://docs.docker.com/build/cache/optimize/
- https://docs.docker.com/reference/dockerfile/
- Docker Image 以 Layers 表現檔案系統狀態；Build Cache Record 與最終 Image FS Layer 不是一對一；COPY 檔案變化等會使 Cache 失效。

## E5 — Network and persistence
- https://docs.docker.com/engine/network/drivers/bridge/
- https://docs.docker.com/engine/storage/
- User-defined Bridge 網路可提供隔離及同網路通訊；雙 Network Container 不自動替其他 Container 路由。容器可寫層與 Volume 是不同的資料生命週期。

## E6 — Runtime / Kubernetes
- https://docs.docker.com/get-started/docker-overview
- https://kubernetes.io/docs/concepts/containers/cri/
- https://kubernetes.io/docs/setup/production-environment/container-runtimes/
- dockerd 負責 Docker Engine 管理；containerd 與 OCI Runtime 可執行底層 Container 工作；Kubelet 透過 CRI 連線支援的 Container Runtime，非必經 Docker Engine。

## Teaching evidence / limitations
- 這是依官方文件交叉查核後設計的概念教材，不是公司部署環境的觀察紀錄。
- 第一堂的互動模型為可切換的概念示意圖，不假裝在瀏覽器中模擬真實 Linux Kernel。
- 真正的 Docker CLI、Image、Network 行為將在後續 Lab 透過實際命令驗證。
