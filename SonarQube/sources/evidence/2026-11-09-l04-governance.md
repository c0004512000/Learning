# Lesson 04 — Rule / Profile / Gate / New Code 官方核對（2026-11-09）

範圍：SonarQube Community Build 公開文件。此檔為可追溯知識來源，不表示完成真實 Server／CI／UI 驗證。

| 主題 | 檢查結果 | 官方來源 |
|---|---|---|
| Rule 與 Issue | Rule 是檢查定義；掃描符合規則才產生 Issue。 | https://docs.sonarsource.com/sonarqube-community-build/quality-standards-administration/managing-rules/rules |
| Quality Profile | 按語言啟用一組規則，內建 Profile 不直接編輯；自訂可 Extend / Copy / Blank。 | https://docs.sonarsource.com/sonarqube-community-build/quality-standards-administration/managing-quality-profiles/creating-a-quality-profile |
| Project 指派 | Project Settings > Quality Profiles 逐語言指定；否則用 Instance Default。 | https://docs.sonarsource.com/sonarqube-community-build/project-administration/adjusting-analysis/changing-quality-profiles |
| Custom Rules | Java Plugin、XPath Template、External Issue Import 是三種擴充路線；外部規則不加入 Profile。 | https://docs.sonarsource.com/sonarqube-community-build/extension-guide/adding-coding-rules |
| Python Plugin | Java + Python Analyzer APIs / AST Visitor，Rule Definition 和檢查邏輯分工。 | https://docs.sonarsource.com/sonarqube-community-build/analyzing-source-code/languages/python |
| Rule Metadata | Rule Type、Severity、Software Quality 在 Rule 定義／模板 UI 設定，Profile 可覆寫部分可調參數；MQR 一條 Rule 可影響多個品質面向。 | https://docs.sonarsource.com/sonarqube-community-build/quality-standards-administration/managing-rules/rules |
| Gate | Metric + operator + threshold 組成條件集合，結果 PASS / FAIL；Community Build 不直接提供 SonarQube Server Prioritized Rules Gate Condition。 | https://docs.sonarsource.com/sonarqube-community-build/quality-standards-administration/managing-quality-gates/introduction-to-quality-gates |
| External Issues | 可參與 Gate 評估，但外部 Rule 無法在 Rules / Profiles 管理。 | https://docs.sonarsource.com/sonarqube-community-build/analyzing-source-code/importing-external-issues/about-external-issues |
| New Code | Specific analysis、Number of days、Previous version、Reference branch 的起算語意不同；New Code 不等於與上一 Commit 比較。 | https://docs.sonarsource.com/sonarqube-community-build/user-guide/about-new-code |
| Specific analysis | **Community Build 目前需使用 Web API 設定；Project UI 不提供此項直接選擇。** 需指定已完成分析。 | https://docs.sonarsource.com/sonarqube-community-build/project-administration/adjusting-analysis/configuring-new-code-calculation |
| Coverage | 測試工具先產出報告、Scanner 再匯入；缺報告不應概括為一律 0% 或 Fail。 | https://docs.sonarsource.com/sonarqube-community-build/analyzing-source-code/test-coverage/overview |
| Fudge Factor | 官方預設對少量新碼的 Coverage／Duplication Gate 條件有忽略機制。 | https://docs.sonarsource.com/sonarqube-community-build/quality-standards-administration/managing-quality-gates/introduction-to-quality-gates |
| CI | sonar.qualitygate.wait=true 會等候 Gate、FAIL 時讓 Scanner 步驟失敗；CI 還需 Job dependency。 | https://docs.sonarsource.com/sonarqube-community-build/analyzing-source-code/analysis-parameters/parameters-not-settable-in-ui |

## 教材修正與驗收界線

- 不可把在 UI 選取未來時間或填入 Commit SHA，說成 Specific analysis 的標準設定。
- 將「導入時固定比較基準」與「每次 Commit 重新分析」明確拆開，避免未修新問題因移動基準而被新碼門禁漏掉。
- 分清 Plugin 檢查邏輯、Rule Metadata、Rules Template UI 建立與 Quality Profile 的 Severity / 參數 override。
- 沒有真實環境的 Coverage 匯入、Gate Failure 和 CI Job 阻擋驗證，不可標記整堂 Lesson 已完成；問答中局部正確也不等於通過全部能力驗收。
