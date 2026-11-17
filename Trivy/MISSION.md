# Trivy Learning Mission

## 我想達成什麼

以現有 GitHub Actions / ARC shell runner / Kubernetes + Harbor / Windows IIS CI/CD 為基礎，從第一性原理理解 Trivy 的依賴與 Image 漏洞掃描，設計一套可驗證、可維運、可漸進導入的共用 CI 流程。

## 具體完成條件

1. 能說明 Trivy 的掃描輸入、套件辨識、漏洞資料比對、報告與阻擋各自的責任。
2. 能對 .NET 9、.NET Framework 4.8、Node.js npm/pnpm 與 Python 的真實建置產物完成足夠的覆蓋率驗證，並清楚記錄不能支援、能支援、可由 CI 補強的項目。
3. 能在 KubernetesDeployment 與 WindowsDeployment 找到正確的掃描時點，不讓「阻擋」發生在實際部署之後。
4. 能定義 CommonActionDeployment 的輸入、輸出、報告、錯誤處理、可修補漏洞與例外治理契約。
5. 能提出分批導入、工具和漏洞資料庫更新、掃描失敗、基準線與重新掃描的企業維運策略。

## 學習方式

依據 [Learning-from-docs Skill](https://github.com/c0004512000/Skills/blob/main/Learning/Learning-from-docs/SKILL.md)，完整規劃 Course Map；詳細 Lesson 逐步寫作，每堂採用「概念 → 因果 → 例子 → 練習／回饋 → 回顧」，理解驗收與文件完成分開記錄。

目前只建立教材和學習計畫，不代表已經在公司環境執行 Trivy 或完成企業上線。
