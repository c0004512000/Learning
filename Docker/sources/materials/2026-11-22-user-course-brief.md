# User-designated Docker course brief

目標：5 堂 × 30 分鐘，面向有程式開發經驗的工程師；從 Docker 基礎建立通往 Kubernetes / CKA 的概念。

1. Why Containerization?：傳統部署、VM / Container、Kernel / System Call、輕量觀察。
2. How Containers Work：Process、PID、Namespaces、cgroups、RootFS、Docker Engine。
3. Docker Image & Dockerfile：Layers、Dockerfile、CMD/ENTRYPOINT、Build Cache、Multi-stage。
4. Networking & Storage：Lifecycle、Bridge、IP/Port、Network A/B、雙網路 Container、Volumes。
5. From Docker to Kubernetes：Docker CLI → dockerd → containerd → runc → Kernel；OCI/CRI 與 K8s。

教學限制：遵循 @lfd；每個新名詞首次出現要先建立前置知識；視覺呈現須真能促進理解，不要為使用互動而使用；整堂內容需實際支撐 30 分鐘。使用現有 Learning GitHub Pages/CSS。2026-11-22 使用者明確要求重寫，不以其他 Agent 修改的舊課文作為來源。

本檔是需求，不作為 Docker 技術事實來源。
