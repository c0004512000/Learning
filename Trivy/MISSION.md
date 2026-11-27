# Trivy Learning Mission

以 GitHub Actions / ARC shell runner / Windows IIS 與 Kubernetes 的現有 CI/CD 為基礎，獨立理解、使用、除錯與維運 Trivy 的 filesystem dependency vulnerability scan；Image Scan 僅為工具能力的比較，不是本次實作要求。

## 完成條件
- 能從需求自行組合 CLI、flags、config、環境變數。
- 能說明 DB 來源、OCI 分發、schema、metadata、cache、離線與更新。
- 能讀懂 log、summary、table、JSON、severity/status/fixed version，區分掃描失敗、覆蓋不足、未命中與政策命中。
- 能以 .NET 9、.NET Framework 4.8、npm/pnpm、Python 的實際 restore/install 資料驗證覆蓋，不將範例硬編碼進共用流程。
- 能設計共用 workflow、部署前掃描時機、report-only／gate、例外及長期維運；公司 CI 實測另記錄。

依據 [Learning-from-docs](https://github.com/c0004512000/Skills/blob/main/Learning/Learning-from-docs/SKILL.md) 逐堂驗收，不將閱讀等同理解。
