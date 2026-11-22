# Mission: Docker Fundamentals

## Why
為具備基本程式開發經驗的工程師設計逐步深入的 Docker／Container 內部技術分享，每堂約 30 分鐘。目標不只是知道 Docker 有哪些指令，而是建立能推論系統行為的模型，並銜接 Kubernetes／CKA。

## Success looks like
- 能從 Program 與 Process 逐步定義 Container，分辨 Docker、Dockerfile、Image 與 Container。
- 能用實際部署案例解釋 Containerization 的價值、邊界與取捨，並理解為什麼交付版本化 Image。
- 能說明 Linux Kernel、Namespaces、cgroups、Root Filesystem 的作用，並正確比較 VM。
- 能理解 Dockerfile、Image Layers、Build Cache 與指令順序，掌握 CMD／ENTRYPOINT、ADD／COPY 等常見誤區。
- 能觀察 Container Lifecycle、Writable Layer、Volumes、Bind Mounts。
- 能實驗 Docker Bridge、Port Mapping、獨立 Network、雙網路 Proxy 的隔離與應用層連線。
- 能說明 Docker CLI → dockerd → containerd → runc，以及 kubelet → CRI → Container Runtime，理解 Kubernetes 的需求。

## Constraints
- 8 個 Session × 約 30 分鐘；時間以理解與吸收為優先，不限制日後加長或拆分。
- 依 @lfd：What → Why → How，先已知事實再術語，從因果與觀察建立模型；不可在尚未解釋 Container 前突然討論 VM。
- 完整 Course Map 先規劃，正式 Lesson 逐堂寫作；每堂包含具體案例、必要示意圖、理解練習與官方來源。
- 繁體中文（臺灣用語）、沿用 Docker/assets/style.css 等共用資產，Dark-first、手機可讀。
- 不假設大家已有 Kernel／Namespace／Hypervisor／OCI／CRI 知識；不要把指令清單當成教學。
- 已撰寫與正式驗收分開紀錄；若尚未在公司環境實驗，須明示是預期結果。

## Learning order
01 What Is a Container & Docker? → 02 Why Containerization? → 03 How Containers Work → 04 Dockerfile & Image Layers → 05 Docker Build Cache & Best Practices → 06 Container Lifecycle & Storage → 07 Docker Networking → 08 From Docker to Kubernetes.

## Out of scope
Kernel Source Code 深挖、完整 CLI 指令手冊、正式多節點 Kubernetes 架構實作及企業生產環境動手修改。
