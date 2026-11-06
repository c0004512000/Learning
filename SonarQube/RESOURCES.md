# Sources / RESOURCES

資料核對日：2026-11-06。SonarQube Community Build 的 release cadence 與功能可能改變，操作前請再次確認官方版本文件。

## Learner-designated materials
- 既有討論所形成的架構圖與問題（存成材料描述）：[`sources/materials/starting-point.md`](sources/materials/starting-point.md)
- 使用者既有 CI/CD 模型：GitHub Actions / self-hosted Runner / Kubernetes / Deployment & Test Gates；作為需要後續核對的背景，不等於已讀取公司工作流程原文。

## Primary official references
1. [Analysis overview](https://docs.sonarsource.com/sonarqube-community-build/analyzing-source-code/analysis-overview) — Scanner 到 Server 的路徑、主分支模型。
2. [GitHub integration introduction](https://docs.sonarsource.com/sonarqube-community-build/devops-platform-integration/github-integration/introduction) — 免費版不支援原生多分支、PR 分析。
3. [CI integration overview](https://docs.sonarsource.com/sonarqube-community-build/analyzing-source-code/ci-integration/overview) — Quality Gate wait 與 CI job 失敗。
4. [Scanner](https://docs.sonarsource.com/sonarqube-community-build/analyzing-source-code/scanners/sonarscanner) — Scanner CLI / token / host URL。
5. [Project analysis setup](https://docs.sonarsource.com/sonarqube-community-build/analyzing-source-code/overview) — clone depth 與 Scanner 準備。
6. [Coverage](https://docs.sonarsource.com/sonarqube-community-build/analyzing-source-code/test-coverage/overview) — 外部測試工具產出報告再匯入。
7. [Docker setup](https://docs.sonarsource.com/sonarqube-community-build/server-installation/from-docker-image/set-up-and-start-container) — 容器安裝。
8. [Database](https://docs.sonarsource.com/sonarqube-community-build/server-installation/installing-the-database) — H2 / PostgreSQL 正式使用。
9. [SonarSource download](https://www.sonarsource.com/products/sonarqube/downloads/) — Community Build 功能與語言支持。
10. [Official SonarQube Scan Action](https://github.com/SonarSource/sonarqube-scan-action) — GitHub Actions 呼叫方式。

## Evidence log
- [`sources/evidence/2026-11-official-baseline.md`](sources/evidence/2026-11-official-baseline.md)

不以舊 Community Edition 文件取代目前 Community Build 官方說明。
