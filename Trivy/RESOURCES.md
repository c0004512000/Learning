# Trivy — 學習來源

## 主要來源（官方）

- [Trivy 官方文件](https://trivy.dev/docs/latest/)
- [Filesystem scanning](https://trivy.dev/docs/latest/guide/target/filesystem/)：`trivy fs` 的掃描範圍、漏洞、Secret、Misconfig 設定
- [Container Image scanning](https://trivy.dev/docs/latest/guide/target/container_image/)：`trivy image`、OS/Application packages、Image 來源
- [Trivy Python coverage](https://trivy.dev/docs/latest/guide/coverage/language/python/)：requirements、直接與間接依賴、pip freeze
- [Trivy .NET coverage](https://trivy.dev/docs/latest/guide/coverage/language/dotnet/)：packages.config、packages.lock.json、*.deps.json
- [Trivy reporting](https://trivy.dev/docs/latest/guide/configuration/reporting/)：報告格式與資料呈現
- [官方 trivy-action](https://github.com/aquasecurity/trivy-action)：GitHub Actions 整合

## 指定工作環境（GitHub）

- [KubernetesDeployment — Docker build workflow](https://github.com/c0004512000/KubernetesDeployment/blob/82a2e2969de37f27f0be607877a26dd88febdfd5/.github/workflows/build-docker-image.yml)
- [KubernetesDeployment — deploy workflow](https://github.com/c0004512000/KubernetesDeployment/blob/82a2e2969de37f27f0be607877a26dd88febdfd5/.github/workflows/deploy.yml)
- [WindowsDeployment — backend](https://github.com/c0004512000/WindowsDeployment/blob/ad8b36acdd73396a9583e54e54d546a0b3ba4bf8/.github/workflows/deploy-backend.yml)
- [WindowsDeployment — frontend](https://github.com/c0004512000/WindowsDeployment/blob/ad8b36acdd73396a9583e54e54d546a0b3ba4bf8/.github/workflows/deploy-frontend.yml)
- [CommonActionDeployment — secret scanning gate precedent](https://github.com/c0004512000/CommonActionDeployment/blob/a8dd1f5d9acfe4f6bef9a2d62dec21574f9ed15d/.github/actions/secret-scanning-blocking-check/action.yml)

## 既有 PoC 資料

- 先前 ChatGPT Library 的 Trivy CLI PoC 報告：以 .NET、npm、pnpm、Python 測試套件辨識能力。該報告不是在公司 CI 或 Runner 上執行；先前樣本結果僅作為下一階段的假說與重測依據。

可重用的查核結果見 [sources/evidence/2026-11-18-source-baseline.md](sources/evidence/2026-11-18-source-baseline.md)。

## Phase 02：CLI 實驗與報告

- [CLI filesystem](https://trivy.dev/docs/latest/guide/references/configuration/cli/trivy_filesystem/)
- [CLI image](https://trivy.dev/docs/latest/guide/references/configuration/cli/trivy_image/)
- [官方安裝文件](https://trivy.dev/docs/latest/getting-started/installation/)
- [Exit code](https://trivy.dev/docs/v0.75/guide/configuration/others/)
- [Requests CVE-2024-35195 公告](https://github.com/advisories/GHSA-9wx4-h78v-vm56)
- [Phase 02 查核證據](sources/evidence/2026-11-19-cli-poc.md)

## Phase 02 前導：Trivy CLI 基礎概念

- [Filesystem target](https://trivy.dev/docs/latest/guide/target/filesystem/)
- [Code Repository target](https://trivy.dev/docs/latest/guide/target/repository/)
- [Container Image target](https://trivy.dev/docs/latest/guide/target/container_image/)
- [Vulnerability Scanner](https://trivy.dev/docs/latest/guide/scanner/vulnerability/)
- [Database and update mechanism](https://trivy.dev/docs/latest/guide/configuration/db/)
- [Standalone operation](https://trivy.dev/docs/latest/guide/references/modes/standalone/)
- [已查核的前導課來源證據](sources/evidence/2026-11-22-cli-fundamentals.md)
