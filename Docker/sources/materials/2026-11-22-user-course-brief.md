# Learner-designated starting material

2026-11-22 初始課程設計，來自使用者在本次對話指定的教學需求（非外部網頁材料）。

- 目標：非 SRE 的同事可在後續學習 Kubernetes / CKA 時理解 Container、Docker 與底層運作。
- 範圍：需要「為什麼 Container」的深層動機，VM / Container 架構與 Kernel 之別，Process、Filesystem、Namespace、cgroups。
- 實作：Dockerfile Layers、CMD / ENTRYPOINT、ADD / COPY、Build Cache、Network A/B 隔離、跨網路 API、Volume。
- 銜接：Docker CLI → dockerd → containerd → runc → Linux Kernel，以及 Kubernetes CRI 對照。
- 形式：每次約 30 分鐘、可安排多堂；互動式 HTML、具因果意義的架構圖；遵循 @lfd 並發布到既有 Learning Repo 的 GitHub Pages。

本來源為主題、教學深度與使用需求，不以它作為產品行為的技術權威；技術依據另見 evidence 與官方文件。
