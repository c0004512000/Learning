# Phase 02 — 官方功能邊界與治理模型核對

核對：2026-11-07。範圍：Community Build，不混入 SonarQube Cloud Free 或商業版。

1. **Main branch only**。Community Build 支援單一主分支分析，不支援原生多分支與 PR Analysis / Decoration。GitHub Actions 的 `pull_request` trigger 不改變產品本身的支援邊界。https://docs.sonarsource.com/sonarqube-community-build/feature-comparison-table · https://docs.sonarsource.com/sonarqube-community-build/devops-platform-integration/github-integration/introduction · https://docs.sonarsource.com/sonarqube-community-build/devops-platform-integration/github-integration/adding-analysis-to-github-actions-workflow
2. **CI integration 仍支援**。在 GitHub Actions 啟動 Scanner 並提交分析報告可行；若需要依 Gate 阻擋工作流程，還需另外將 Gate 狀態接入 CI 的失敗策略。https://docs.sonarsource.com/sonarqube-community-build/quality-standards-administration/managing-quality-gates/introduction-to-quality-gates
3. **Custom Quality Profiles and Quality Gates**。Community Build 兩者都支援自訂。Profile 是 per-language active Rules；Gate 是 per-project condition set。https://docs.sonarsource.com/sonarqube-community-build/feature-comparison-table · https://docs.sonarsource.com/sonarqube-community-build/quality-standards-administration/managing-quality-profiles/understanding-quality-profiles · https://docs.sonarsource.com/sonarqube-community-build/quality-standards-administration/managing-quality-gates/introduction-to-quality-gates
4. **26.10 Built-in profiles changed**。每語言內建 Sonar way core（新安裝預設）、extended、comprehensive。comprehensive 取代舊名 Sonar way；從舊版升級到 26.10 的既有專案仍保留先前 Profile 與 default。https://docs.sonarsource.com/sonarqube-community-build/quality-standards-administration/managing-quality-profiles/built-in-quality-profiles
5. **New Code != PR Analysis**。主分支掃描可定義 New Code 並依新程式碼品質門檻判定，不等於針對 Pull Request source/target 的原生分析。https://docs.sonarsource.com/sonarqube-community-build/user-guide/about-new-code
6. **Rule != Issue**。Rule 是檢查條件；程式碼違反啟用規則時才建立 Issue。Rule set 由 Quality Profile 決定。https://docs.sonarsource.com/sonarqube-community-build/quality-standards-administration/managing-rules/rules · https://docs.sonarsource.com/sonarqube-community-build/quality-standards-administration/managing-quality-profiles/understanding-quality-profiles
7. **Gate conditions**。可依新碼或全碼的 Metrics（Issue、Coverage、Duplication 等）判定 PASS/FAIL，並可通知 CI。Sonar way Gate 與 Quality Profile 同名但功能獨立。https://docs.sonarsource.com/sonarqube-community-build/quality-standards-administration/managing-quality-gates/introduction-to-quality-gates
8. **Coverage / Duplication small changes**。官方預設 Fudge Factor，在符合少量新增程式碼條件時忽略 Coverage / Duplication Gate 條件。https://docs.sonarsource.com/sonarqube-community-build/quality-standards-administration/managing-quality-gates/introduction-to-quality-gates · https://docs.sonarsource.com/sonarqube-community-build/project-administration/adjusting-analysis/changing-quality-gate-and-fudge-factor
9. **MQR vs Standard**。不同模式用不同的品質分類與嚴重程度體系；更改模式會影響指標與 Gate 條件。https://docs.sonarsource.com/sonarqube-community-build/user-guide/code-metrics/changing-modes
10. **Security Hotspots 版本遷移**。官方新文件指出逐步將 Hotspots 轉為安全 Issues；不要在教材把 Security Hotspots 當成所有版本都穩定同名且同處理方式的功能。https://docs.sonarsource.com/sonarqube-community-build/quality-standards-administration/managing-quality-gates/introduction-to-quality-gates

## 未驗證事項
- 未取得公司 GitHub Enterprise 原始 workflow 與 Runner 的 SonarQube 連線、GitHub App、網路或相容性證據。
- 沒有做本機或公司 SonarQube 真實 POC；教材中的 policy lab 是明確標示的瀏覽器端概念模擬。
- GitHub Pages 的發布成功不代表學生完成 lesson / POC 驗收。

## Precise distinction added 2026-11-07
- A GitHub Actions `pull_request` event can start a Runner and Scanner, including reading a PR checkout. However the Community Build does not provide native pull-request/branch analysis storage, comparisons or PR decoration. Official instructions explicitly say only scan the main branch with Community Build, not use `on.pull_request` for SonarQube analysis. The outcome of trying unsupported parameters/checkout depends on scanner, version and configuration; do not make categorical claims that it will always error, always not scan, or always write main. https://docs.sonarsource.com/sonarqube-community-build/devops-platform-integration/github-integration/adding-analysis-to-github-actions-workflow
- The SonarQube Project represents the repository's analysis within SonarQube; projectKey routes the analysis. https://docs.sonarsource.com/sonarqube-community-build/analyzing-source-code/overview


## 2026-11-08 — SonarQube main branch vs GitHub default branch
- Main Branch is a logical analysis identity inside a SonarQube Project. The code scanned depends on what is checked out in CI, not on the label "main". Community Build can track a non-default Git branch (e.g. `develop`) as the Project's only analysis; this does not unlock native multi-branch analysis. The SonarSource staff explain that scanning another branch under the same project key can overwrite the existing sole analysis: https://community.sonarsource.com/t/what-is-main-branch-in-community-edition/110307
- In Sep 2025 SonarSource staff confirmed that changing a GitHub workflow to run on `develop` to track that branch was appropriate, and advised renaming the displayed branch for clarity: https://community.sonarsource.com/t/branch-analysis-develop-instead-of-main/148138
- Official GitHub Actions documentation recommends scanning only the Project's chosen main branch, not `pull_request` analysis. Avoid treating this as a rule that the SCM branch must literally be named `main`: https://docs.sonarsource.com/sonarqube-community-build/devops-platform-integration/github-integration/adding-analysis-to-github-actions-workflow
- Important: a branch *rename* in SonarQube alone does not checkout a different Git ref; changing the scanner input and preserving a consistent Project Key / main branch mapping is required. This is documentation/official-staff corroboration, not an executed project-level PoC.
