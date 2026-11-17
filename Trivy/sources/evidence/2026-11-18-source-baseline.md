# Trivy — 已查核的教學基準（2026-11-18）

## 來源與已確認的概念

1. Trivy 的 Filesystem 掃描能讀取專案內的套件相關檔案；可做漏洞、Secret、Misconfiguration、License 等掃描，但預設開啟哪些 scanner 與此導入課程採用的 `--scanners vuln` 限定不同。[官方 Filesystem](https://trivy.dev/docs/latest/guide/target/filesystem/)
2. `trivy image` 以 Container Image 為目標，可分析已封裝進 Image 的 OS 與應用程式套件；不等於「任意原始碼的 SAST」。[官方 Image](https://trivy.dev/docs/latest/guide/target/container_image/)
3. Python 的 `requirements.txt` 往往只有直接依賴；`pip freeze` 能列出安裝環境實際可列舉的直接／間接套件，但必須使用正確的、與部署相符的環境。[官方 Python](https://trivy.dev/docs/latest/guide/coverage/language/python/)
4. .NET 可從 `packages.config`、`packages.lock.json`、`*.deps.json` 等格式取得不同層次的套件資訊。是否包含間接依賴和 runtime package，必須按格式核對。[官方 .NET](https://trivy.dev/docs/latest/guide/coverage/language/dotnet/)
5. 先前 Trivy CLI PoC 樣本中的數字：.NET 9 無 lockfile 0/9、補 lockfile 9/9；packages.config 2/2；npm 50/50、pnpm 52/52；Python 只用 requirements 1/5、freeze 後 5/5。**這些是先前特定樣本的「套件辨識數量」，不是 CVE 數量、漏洞覆蓋率或公司部署驗證。**

## 企業環境路徑（GitHub workflow 靜態查核）

- KubernetesDeployment 的 build workflow 將建置與推送接在一起；要在 push 前擋住，需要拆分步驟，或改以 immutable image digest 於 GitOps deploy 前設定 gate。
- KubernetesDeployment 的 deploy workflow 負責更新 GitOps 中的部署版本，故 gate 應在此操作之前。
- WindowsDeployment backend workflow 的部分 publish / MSBuild 支線可能直接觸發部署；掃描不能放在此類動作後面。
- WindowsDeployment frontend workflow 的 npm install、build、msdeploy 若在同一個 step，必須拆開才能精準設 Gate。

這是**工作流程原始碼的靜態觀察**，不是對企業環境做過 Trivy 掃描、Runner 相容性測試或實際阻擋測試。Workflow 來源固定版號見 [RESOURCES.md](../../RESOURCES.md)。

## 待實驗項目

Scanner 版本和下載來源、企業 CA／Proxy／DB、Windows Runner 執行權限、Docker socket、套件辨識完整度、報告形式、exit code、隔離機制、CI 異常分類、真正部署前阻擋。

## 本章的學習邊界

Phase 01 只建立工具的目的、因果流程和不同掃描輸入；安裝 CLI、產出報告和驗證 CI 都在後續 Phase。
