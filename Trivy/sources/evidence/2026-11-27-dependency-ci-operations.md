# Dependency、CI 與 Operations 教材查核（2026-11-27）

- [Trivy .NET](https://trivy.dev/docs/latest/guide/coverage/language/dotnet/)：packages.config 為平坦名稱版本；packages.lock.json 支援傳遞依賴及 graph；deps.json 為 runtime；目前文件也列 *Packages.props，但不能取代完整 resolved inventory。
- [Trivy Node.js](https://trivy.dev/docs/latest/guide/coverage/language/nodejs/)：npm lockfile、pnpm lockfile 與 dev scope；pnpm v9+ 的 dev 標記；依版本與實際 context 驗證。
- [Trivy Python](https://trivy.dev/docs/latest/guide/coverage/language/python/)：預設精確版本，comprehensive 可採最小版本；freeze 或 compile 補強間接依賴；Poetry/uv lockfile 支援與 dev group 差異。
- [NuGet restore](https://learn.microsoft.com/en-us/nuget/consume-packages/package-references-in-project-files)：[MSBuild](https://learn.microsoft.com/en-us/nuget/reference/msbuild-targets)：lockfile opt-in、locked mode 與解析結果。
- [GitHub reusable workflow](https://docs.github.com/en/actions/how-tos/reuse-automations/reuse-workflows)：job-level 呼叫、SHA pinning；不同 job 不假設共享 workspace。[Secure use](https://docs.github.com/en/actions/reference/security/secure-use)：最小權限、不可信輸入、固定可信 action ref。
- [DB](https://trivy.dev/docs/latest/guide/configuration/db/)、[Cache](https://trivy.dev/docs/latest/configuration/cache/)、[Filtering](https://trivy.dev/docs/latest/guide/configuration/filtering/)、[VEX](https://trivy.dev/docs/latest/guide/supply-chain/vex/)、[Reporting](https://trivy.dev/docs/latest/guide/configuration/reporting/)：分離掃描、報告與政策。
- 重新讀取 RESOURCES.md 所列固定修訂的 KubernetesDeployment build/deploy、WindowsDeployment backend/frontend、CommonActionDeployment secret scanning gate。歷史 build Docker/push 同步驟，GitOps repo push 先於 Argo CD；Windows backend restore 後的 publish/MSBuild 可能直接部署，frontend install/build/msdeploy 同步驟。這些是固定版本靜態觀察，不是當前 production 驗證。
- 舊 PoC 數字沿用，非本次重跑。Poetry/uv 樣本數字屬先前紀錄，未讀取原報告重驗，不可當成普遍結果。

範例 workflow 為教學契約或骨架，未部署至企業 repo；未執行 Trivy、NuGet/npm/pnpm/pip、Runner 或真實 Gate。需依核准版本、語言、實際 repository、CI runner 與組織政策驗證。
