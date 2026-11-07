# Learning Record 0001 — Analysis Report 與 Compute Engine 的責任邊界

- 日期：2026-11-07
- 對應課程：Lesson 02（Scanner → Server → Dashboard）
- 觀察：學習者指出已經有 Analysis Report，為什麼還需要 Compute Engine 進行「分析」？原教材未先說明報告為何物，以及 Scanner 和 CE 在計算階段的不同。
- 尚未可判定：學習者是否已掌握概念。提問只構成理解缺口的證據，不能視為作答或實作驗收通過。

## 教學衍生要求

- 在敘述 Server Processing 之前，先明確建立「Analysis Report 是機器可讀的結構化掃描輸出，而非 Dashboard 報表」的模型。
- 區分 Scanner 對原始碼的規則分析，以及 Compute Engine 的跨檔案彙總、衍生指標、Issue 關聯、Quality Gate、持久化處理。
- 不用「重新分析原始碼」描述 CE；說明 Background Task 未完成時，Scanner execution success 並不代表 Dashboard 已更新。
- 在正式實作前保留精簡示例，但標示它不是實際封包格式。後續可用計算指標、Pending 任務狀態做動手觀察。

## 修正位置

- `lessons/0002-analysis-flow.html`：新增 Analysis Report 解釋與簡化資料範例、調整處理責任與因果順序。
- `reference/0002-glossary.html`：明確定義 Analysis Report 與 Compute Engine。

## 權威來源

- https://docs.sonarsource.com/sonarqube-community-build/extension-guide/developing-a-plugin/plugin-basics
- https://docs.sonarsource.com/sonarqube-community-build/server-installation/server-components-overview
- https://docs.sonarsource.com/sonarqube-server/analyzing-source-code/background-tasks
