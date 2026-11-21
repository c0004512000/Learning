# Notes — Docker Learning

- 目標讀者：非 SRE 專業，但有一般軟體開發背景的同事。以可理解的深度談原理，避免內容表層化。
- 對 VM vs Container 的 Guest OS / Kernel / System Call 比較有較高教學優先權。
- 使用原生 HTML/CSS/JS 展示可理解的切換比較與架構路徑；不是為互動而互動。
- Dockerfile 中 Layer、Build Cache、CMD/ENTRYPOINT、ADD/COPY 與 Multi-stage 都應在課綱內。
- Network A/B 隔離與雙 Network 的 API/Proxy 實驗應明確區分「加入多網路」與「自動路由」。
- Container Runtime 路徑於後段介紹：Docker CLI → dockerd → containerd → runc → Kernel；K8s 對比 kubelet → CRI → containerd。
- 每個 Learning HTML Lesson 一個聚焦成果，5 次分享可安排 8 堂短 Lesson；逐堂產出。
- 第一堂教材已撰寫但未獲學員正式驗收；不要因此將進度標為完成。
