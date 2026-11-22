# User-designated Docker course brief — revised 2026-11-22

## Mission
面向具備程式開發經驗的工程師，透過每次約 30 分鐘的技術分享，建立 Docker／Container 概念，讓大家能往 Kubernetes／CKA 延伸。堂數以理解效果為主，不限制兩堂、三堂或五堂；目前規劃八堂，每堂約 30 分鐘。

## Explicit teaching constraints
- 必須先 What 再 Why：不能在學員連 Container 是什麼都不知道時，直接問「為什麼需要 Container」，更不應突然用 VM 來比較。
- 從 Program → Process → Container → Docker、Dockerfile、Image 一步一步建構知識；新名詞首次出現要有前置知識。
- Why 不可只說「解決環境不一致」，應解釋傳統部署、Runtime、Libraries、部署 Artifact、跨環境一致性與取捨。
- Dockerfile 的深度包含：哪些指令可能造成 Filesystem Layer、哪些是 Metadata、CMD / ENTRYPOINT、ADD / COPY、Docker Build Cache、指令排序、Multi-stage 等。
- Docker CLI 是為了驗證，而不是背指令；Lifecycle、Volume、Network 都要透過實際觀察說明。
- Network 堂需要演示 Network A、Network B 彼此隔離，以及同時連接兩個 Network 的 Proxy / Gateway Container 如何轉送指定應用請求；不要錯誤地宣稱 Docker Network 有巢狀包含關係。
- 以 dockerd / containerd / runc、OCI / CRI 與 Kubernetes 做最後的架構銜接。
- 遵循 @lfd，使用 Learning GitHub Pages，沿用既有 CSS，課程地圖先完整規劃、Lesson 逐堂詳細撰寫，並實際發佈。

## Current planned sequence
1. What Is a Container & Docker?
2. Why Containerization?
3. How Containers Work
4. Dockerfile & Image Layers
5. Docker Build Cache & Best Practices
6. Container Lifecycle & Storage
7. Docker Networking
8. From Docker to Kubernetes

本檔記錄學員需求與學習限制，不作為 Docker 技術事實來源。
