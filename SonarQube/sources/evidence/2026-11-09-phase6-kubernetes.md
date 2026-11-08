# Phase 06：Community Build K8s / Recovery 官方核對（2026-11-09）

本 Evidence 檔僅引用公開官方文件。它證明教材所述功能有來源，不證明任何私人叢集已部署、已通過備份／還原／升級演練。

| 決策問題 | 可核實的官方事實 | 官方來源 |
|---|---|---|
| Server 內部有哪些程序？ | Web、Elasticsearch、Compute Engine（CE）；DB 保存 Metrics、Issues、設定和 CE Queue；ES 是 Indexed Copy，索引可重建。 | https://docs.sonarsource.com/sonarqube-community-build/server-installation/server-components-overview |
| H2 可正式用嗎？ | Embedded H2 用於開發／測試／試用，不建議 Production；正式環境使用外部受支援的資料庫，資料庫與 Server 低延遲且分離。 | https://docs.sonarsource.com/sonarqube-community-build/server-installation/installing-the-database |
| Chart 自帶 DB 嗎？ | Community Build 26.2 移除了 PostgreSQL Dependency；要依安裝的 Chart／Server 版本核對設定，不可沿用舊 Subchart 假設。 | https://docs.sonarsource.com/sonarqube-community-build/server-installation/on-kubernetes-or-openshift/before-you-start |
| Chart ES Persistence 呢？ | 預設 `persistence.enabled=false`，停機後 ES Index 需重建；開啟可加速啟動，但 Pod 中斷可能導致索引毀損。 | https://docs.sonarsource.com/sonarqube-community-build/server-installation/on-kubernetes-or-openshift/customizing-helm-chart |
| Pod Security／Linux prerequisites？ | Restricted Namespace 需處理高權限 InitSysctl/InitFs；停用 InitContainers 不代表 ES Kernel/Host prerequisite 消失。 | https://docs.sonarsource.com/sonarqube-community-build/server-installation/on-kubernetes-or-openshift/customizing-helm-chart |
| Argo CD Helm 部署呢？ | 官方明確寫 ArgoCD-based deployments not currently fully supported or validated。應獨立測試 Hook／Reconcile／Upgrade，不能宣稱官方保證。 | https://docs.sonarsource.com/sonarqube-community-build/server-installation/on-kubernetes-or-openshift/before-you-start |
| K8s 檢查要注意什麼？ | CPU／Memory／磁碟與啟動／就緒／存活檢查需按負載調整；26.10 提高 Web/CE Default JVM Heaps；不同資源需求不得直接跨版本套用。 | https://docs.sonarsource.com/sonarqube-community-build/server-installation/server-host-requirements ; https://docs.sonarsource.com/sonarqube-community-build/server-installation/on-kubernetes-or-openshift/before-you-start |
| HTTPS／網路路徑？ | Runner/Web Browser 經 Web API 連 Server；SonarQube → DB JDBC；外部 HTTPS 通常需 TLS Reverse Proxy。 | https://docs.sonarsource.com/sonarqube-community-build/server-installation/networking-requirements |
| 備份與還原順序？ | 官方支援 Hot Database Backup；還原：停止 Server → 還原 DB → 清除 ES 索引 → 重啟 Server。K8s 上若無 ES PVC，開機自然會重建。 | https://docs.sonarsource.com/sonarqube-community-build/server-update-and-maintenance/maintenance/backup-and-restore ; https://docs.sonarsource.com/sonarqube-community-build/server-update-and-maintenance/maintenance/reindexing |
| Reindex 時還能 Gate？ | 部分功能恢復有先後；部分 Gate 計算需等待 Index 完成，可能導致 CI 的 Gate Timeout。 | https://docs.sonarsource.com/sonarqube-community-build/server-update-and-maintenance/maintenance/reindexing |
| Upgrade Path？ | 同年原則可直升，跨年須先到前一年度十二月版，實際有例外；更新前要先查 Release Notes 和 Update Path。 | https://docs.sonarsource.com/sonarqube-community-build/server-update-and-maintenance/update/determine-path |
| 升級容量與驗證？ | Migration 過程可能暫時需要平常 DB 空間的兩倍；官方建議使用近期 Production Backup 在 Staging 演練與量測。 | https://docs.sonarsource.com/sonarqube-community-build/server-update-and-maintenance/update/pre-update-steps |
| Helm rollback 是否含 DB？ | 官方更新流程包含 DB Migration；Helm 版本回復不自動回復 DB Schema。此為 K8s/DB 行為的因果推導，並非 Vendor 自動提供的 rollback。 | https://docs.sonarsource.com/sonarqube-community-build/server-update-and-maintenance/update/update |

## 對實務的教學界線
- Phase 06 以「單機／單 Pod Community Build + 外部資料庫」為分析模型，不把 Community 形容成 Data Center Edition / HA 叢集。
- `persistence.enabled` 在官方 Community Helm 文件描述的主要對象是 ES Index，不可宣稱能保住 H2 和整個專案資料。
- 沒有實際 Chart 版本、Server Build、DB Version、Node Kernel 情況之前，Helm Values 僅提供參數分類與渲染示例，不宣稱是可用的 Production Manifest。
- Restore Drill 必須在隔離 DB、隔離 Namespace 驗證，禁止直接在真實生產叢集測試毀損、刪 PVC、滾回 Schema。
- Phase 05 的教材已撰寫 L09／L10，Learning Map 必須與 Phase 06 同步更新；Phase 03 仍暫緩未驗收。

## 待驗收與待實測
- 使用者尚未提供隔離 K8s Helm／PostgreSQL Restore 的真實 Logs、Snapshot、時間與成功結果，因此 Phase 06 是「教材已撰寫、理解／操作未驗收」。
- 部署後 Pages 的 Mobile／Desktop 實際瀏覽器驗證需另作，僅 GitHub Actions 部署成功不能等價。
