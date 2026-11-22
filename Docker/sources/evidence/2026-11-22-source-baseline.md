# Docker learning — verified sources and explanation boundaries
Date: 2026-11-22 Asia/Taipei

## Session 01 verified findings
1. https://docs.docker.com/learn/content/what-is-a-container/ — 官方將 Container 介紹為具隔離環境的 Process（可有多個 Process），Image 是啟動用的封裝；Linux Container 使用 Linux Kernel；Windows/macOS Docker Desktop 可透過 Linux VM。
2. https://docs.docker.com/engine/ — Docker 採 Client/Server 模型，Docker CLI 對 Docker Daemon 發出請求；Image 是唯讀模板，Container 是可執行的 Image 實例。
3. https://docs.docker.com/learn/content/run-your-first-container/ — docker run 建立及啟動 Container，可從同一個 Image 啟動多個實例，docker exec / docker ps 觀察。
4. https://docs.docker.com/reference/cli/docker/container/run/ — -p 127.0.0.1:8080:80 為主機本機綁定 Port 8080 至 Container Port 80 的有效示範。

## Future sessions — source basis
5. https://man7.org/linux/man-pages/man7/namespaces.7.html — Linux Namespace。
6. https://docs.kernel.org/admin-guide/cgroup-v2.html — Linux cgroups。
7. https://docs.docker.com/reference/dockerfile/ — Dockerfile 指令規格。
8. https://docs.docker.com/learn/content/how-image-layers-and-the-build-cache-work/ — Filesystem Layers、Writable Layer。
9. https://docs.docker.com/build/cache/invalidation/ — Build Cache 失效。
10. https://docs.docker.com/engine/network/drivers/bridge/ — Docker Bridge Network、網路隔離。
11. https://docs.docker.com/engine/storage/ — Container Storage。
12. https://kubernetes.io/docs/concepts/containers/cri/ — Kubernetes CRI。
13. https://kubernetes.io/docs/setup/production-environment/container-runtimes/ — Kubernetes Container Runtimes。

## Explanation boundaries
- 程式檔案不是 Process；同一份程式可啟動多個 Process。
- Container 是受隔離與管理的執行環境，並非另一份 Linux Kernel，也不只是檔案系統。
- Dockerfile 描述建構；Image 是唯讀模板；Container 是可以執行與停止的實例。
- 一個 Container 可有一個或多個 Process；處於 Stopped 狀態則沒有正在執行的主要 Process。
- 同一 Image 建立的不同 Container 一般具有各自可寫入層；Volume 可以另外導入共享資料。
- Linux Container 可運行在 Linux VM 裡；Docker Desktop 的 Linux VM 不意味 Container 使用 Windows/macOS Kernel。
- VM 架構、Namespace、cgroups 不應提早成為第一堂理解 Container 的必要前提。
- Image 可以改善封裝內容的一致性，但不保證外部資料庫、Secrets、Environment Variables、Hardware Architecture 一致。
- Network A/B 不具巢狀包含關係；雙網路 Proxy 是在兩個 Network 都有介面的 Container，不會自動開放其他容器相互直接連通。
- 本課程的 Docker Lab 尚未在使用者公司測試環境執行；預期觀察不等於已實測。
