# Mission: Docker Fundamentals — Preparing for Kubernetes / CKA

## Why
為非 SRE 背景、已有軟體開發經驗的同事安排五次、每次約 30 分鐘的技術分享。讓大家知道應用程式如何被封裝成 Container、Docker 為什麼存在、底層 Kernel 隔離如何運作，之後能有脈絡地理解 Kubernetes / CKA。

## Success looks like
- 能由實際部署痛點解釋 Container 化的交付價值，且不混淆 VM 與 Container。
- 能沿 System Call 路徑清楚指出 Guest Kernel 與 Host Kernel 的區別。
- 能判斷 Dockerfile Layer、CMD / ENTRYPOINT、ADD / COPY 與 Cache 重用條件。
- 能透過 Docker CLI 預測 Network A／B 的隔離、多網路連線與資料持久化。
- 能區分 dockerd、containerd、runc、CRI 與 Kubernetes 的角色。

## Constraints
- 每堂分享約 30 分鐘；適合一般軟體開發者，具技術深度但循序介紹名詞。
- 傳統繁體中文，深色優先，手機閱讀；複用 Learning CSS／Quiz。
- 優先用有因果語意的架構圖、互動比較與可觀察操作，不用裝飾性圖表。
- 依 @lfd 先完整規劃 Course Map，再逐堂撰寫；閱讀不等同理解驗收。

## Out of scope
- 深入 Linux Kernel 原始碼、虛擬化硬體指令集、iptables 規則及完整 Docker CLI 指令表。
- 直接建立企業級 Kubernetes Cluster 或考完 CKA；這是 CKA 前備課程。
