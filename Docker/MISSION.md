# Mission: Docker Fundamentals

## Why
為一般開發工程師提供 5 次各約 30 分鐘的內部技術分享，建立 Docker／Container 基礎，之後能理解 Kubernetes / CKA 的設計與運作。

## Success looks like
- 能從程式碼、執行工具、函式庫與設定推導部署問題、Image 的價值。
- 能正確比較 VM 的 Guest Kernel 與 Linux Container 的共享 Host Kernel。
- 能解釋 Container Process 如何被隔離與限制資源，並由 CLI 觀察。
- 能建立 Docker Image、理解 Dockerfile、Image Layers 與 Cache。
- 能驗證網路 A/B、跨網路服務連線，以及 Volume 保存資料。
- 能解釋 Docker CLI → dockerd → containerd → runc 與 Kubernetes CRI。

## Constraints
- 以 @lfd 的 First Principles 和教學順序為準；任何新術語第一次出現先講解，不能拿未知解釋未知。
- 5 Session 各 30 分鐘；可以拆為 8 個聚焦 Lesson，總時數不變。
- 使用繁體中文、原有 dark-first CSS、清楚的架構圖、必要而非強加的互動。
- Course Map 先規劃，詳細教材逐堂撰寫；閱讀或答對測驗不自動視為完成。

## Out of scope
- Linux Kernel Source Code 深挖、完整 Docker CLI 指令手冊、正式多節點 Kubernetes 部署。
