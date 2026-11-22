# Notes — Docker Learning

- 受眾：具基本開發經驗的工程師，非所有人都有 Linux、Kernel、Namespace 或 VM 專業知識。
- 教學必須以 What → Why → How 為學習順序：先定義 Program、Process、Container、Docker、Dockerfile、Image；第二堂再完整解釋需要 Containerization 的原因；第三堂引進 Linux Namespace / cgroups 和 VM 比較。
- 原先開頭「既然已經有 VM，為什麼還需要 Container？」依賴尚未建立的概念，現在已改為新的 Session 01；歷史修正紀錄不放到學員教材裡。
- 深度要足：用案例、實際指令驗證、預測／觀察／解釋建立理解，並包含 Image Layer、Build Cache、CMD/ENTRYPOINT、ADD/COPY、Networks A/B 和 Proxy、Volumes、dockerd/containerd/runc/CRI。
- 不以 Docker CLI 指令數量衡量教學品質；CLI 是驗證模型的工具。
- 全站使用現有 @lfd CSS；手機優先、深色優先、保留真正可工作的 Quiz 和導航。
- 逐堂撰寫：目前 Session 01–02 已完成 HTML 教材，後續 03～08 在 Course Map 規劃中；正式驗收進度仍為 0/8。
