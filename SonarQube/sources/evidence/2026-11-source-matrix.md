# Source-to-Capability Matrix · 2026-11-07

這份 Evidence 紀錄 Course Map 如何將 Mission 轉成十四堂 Lesson 的能力與可觀察驗收。代表「規劃有官方來源基礎」，不是所有 Lesson 已撰寫或實際完成 POC。

| Lesson | 主要官方來源 | 預期能力證據 | 實況 |
|---|---|---|---|
| L01 靜態分析為什麼需要存在？ | https://docs.sonarsource.com/sonarqube-community-build/analyzing-source-code/analysis-overview | 在 E2E 成功情境判斷是否仍需分析，並說出一個未覆蓋的風險 | 已撰寫；未驗收 |
| L02 Scanner 如何把分析結果交給 Server？ | https://docs.sonarsource.com/sonarqube-community-build/analyzing-source-code/analysis-overview | 能解釋 Scanner success 但 Dashboard 未更新時應先查哪個環節 | 已撰寫；未驗收 |
| L03 Community Build 能管理哪些分析？ | https://docs.sonarsource.com/sonarqube-community-build/devops-platform-integration/github-integration/adding-analysis-to-github-actions-workflow | 在 PR 與 main push 兩個案例中，正確說明哪些結果可原生保存 | 已撰寫；未驗收 |
| L04 Rule、Profile、Issue、Gate 如何合作？ | https://docs.sonarsource.com/sonarqube-community-build/quality-standards-administration/managing-quality-gates/introduction-to-quality-gates | 調整模擬器的 Rule 和 Gate，能預測各自對 Issue 與 Gate 的影響 | 已撰寫；未驗收 |
| L05 Project / Project Key 與 POC 部署條件 | https://docs.sonarsource.com/sonarqube-community-build/project-administration/creating-project | 用合成 repo 寫出 Project Key、版本、Docker 與 H2 / DB 的選型證據 | 僅規劃；待實測 |
| L06 完成第一次掃描並核對 Dashboard | https://docs.sonarsource.com/sonarqube-community-build/analyzing-source-code/analysis-overview | 保存 Scanner log、Task 完成狀態、Issue 與 Quality Gate 的對應截圖／值 | 僅規劃；待實測 |
| L07 Runner 如何連上 SonarQube | https://docs.sonarsource.com/sonarqube-community-build/devops-platform-integration/github-integration/adding-analysis-to-github-actions-workflow | 在隔離 repo 跑成功一次掃描，證明 Runner → Server 的連線與授權 | 僅規劃；待實測 |
| L08 Coverage 與 Quality Gate 失敗演練 | https://docs.sonarsource.com/sonarqube-community-build/analyzing-source-code/test-coverage/overview | 用外部測試工具提供 Coverage；展示至少一個預期 Gate FAIL 案例 | 僅規劃；待實測 |
| L09 PR／Merge／Release Tag 的適當整合點 | https://docs.sonarsource.com/sonarqube-community-build/devops-platform-integration/github-integration/introduction | 產出 main、PR、tag 觸發與支援能力矩陣，說明採用與放棄理由 | 僅規劃；待實測 |
| L10 Non-blocking → Blocking 的導入門檻 | https://docs.sonarsource.com/sonarqube-community-build/quality-standards-administration/managing-quality-gates/introduction-to-quality-gates | 設計升級、例外、回退及 SonarQube 不可用時的 CI 行為 | 僅規劃；待實測 |
| L11 Helm、Database、PVC、Ingress 與網路 | https://docs.sonarsource.com/sonarqube-community-build/server-installation/on-kubernetes-or-openshift/customizing-helm-chart | 交付不含機敏資料的部署拓樸和資源／網路驗證清單 | 僅規劃；待實測 |
| L12 Backup、Recovery、Upgrade 與維運 | https://docs.sonarsource.com/sonarqube-community-build/server-installation/installing-the-database | 至少設計並記錄一套備份復原與升級回退驗收方案 | 僅規劃；待實測 |
| L13 不同語言的掃描與規則落差 | https://docs.sonarsource.com/sonarqube-community-build/quality-standards-administration/managing-quality-profiles/understanding-quality-profiles | 完成兩種語言的分析比較，量測執行時間、Issue 噪音和誤報 | 僅規劃；待實測 |
| L14 共用模板、權限與 Rollout 決策 | https://docs.sonarsource.com/sonarqube-community-build/devops-platform-integration/github-integration/adding-analysis-to-github-actions-workflow | 根據實測產出採用／暫緩的 decision record 和 rollout checklist | 僅規劃；待實測 |

## 概念依賴
- L01 知道靜態分析與執行測試的功能差異，才能在 L02 辨識 Scanner 的輸出與 Server 的後續處理。
- L02 建立分析流程後，L03 才比較 CI trigger 與 SonarQube 內真正的分析歸屬。
- L03 明白免費版主分支限制，L04 才討論每份結果依 Rules/Profile/Gate 如何被評估。
- L05 先建立 Project Key 和主分支身分，再部署 POC；L06 才以實測驗證分析鏈路。
- L07 建立 CI 連線，L08 才加入 Coverage 與失敗注入；接著 L09–L10 才能討論門禁治理。
- K8s 運維與跨 repo rollout 需要先有可重複的獨立 POC 與 CI 證據。

## 侷限
- 目前僅對公開的官方文檔進行版本與概念確認；沒有公司私有部署／Runner 實測證據。
- 未來當某一 Lesson 需要特定實作細節，先對該版本官方資料補證，再撰寫具體操作步驟。
- 若學習者的回答暴露必要前置缺口，應先做最小 bridge，不能因此宣稱已完成之前的 Lesson。
