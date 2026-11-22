# Notes — Docker Learning

- 受眾具備一般程式開發經驗，但不要假設已熟悉 Kernel、Process、Hypervisor、Namespace、cgroups 等名詞。
- 必須從已知事實開始：程式執行依賴 → OS/Kernel/Process → VM/Container → 隔離機制 → Image/Build → Networking/Storage → Runtime/Kubernetes。
- 一堂 30 分鐘要有足夠實例、圖解、推理與練習；不能靠冗長描述或一直點「下一步」湊時間。
- 真正的比較直接用完整圖呈現；箭頭必須說明 calls / provides / runs on 等具體語意。
- 歷史修稿批評是教學限制，不應直接寫成學員頁面標題或內容。
- Session 01 不先介紹詳細 Namespace、cgroups、RootFS、OCI、CRI、runc 等機制；後續再逐項推導。
- Lesson 01 已撰寫，尚無正式理解驗收；需要保留真實進度。
