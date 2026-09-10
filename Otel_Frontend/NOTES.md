# Notes

- 學習重心：既有方案接手、協助導入、前後端 Trace 串接、維運、修改與優化。
- 技術選型與主要 SDK 開發在交接前大致完成；後續 Skill／IDP 整合、試點串接、文件與推廣是任務重心。
- HTML 是第一線教學範圍，但不能只讀 rendered text；程式碼、PR、圖、runtime bundle、DevTools、Grafana、OpenSearch 與 Confluence 延伸內容都要用來交叉驗證。
- 不把「頁面可開啟」當成資料流成功；驗證需沿 browser → receiver → processor/exporter → backend store/query 逐段提出證據。

## Learning-from-docs teaching preferences

- 使用者文件是主線與學習邊界；外部官方資料只在文件省略 prerequisite、需要驗證、消除歧義或補必要背景時加入，不能靜默取代原文件。
- 遇到 prerequisite 卡點時，先判斷是最小 bridge、durable reference，還是需要獨立 prerequisite lesson；補完後要回到 Faro 主線。
- 不因建立 reference 就判定 learner 有弱點；只有實際暴露、會影響後續教學的 misconception／gap／mental-model shift 才進 learning record。
- Browser / JavaScript 基礎概念要先用「具體物件、誰持有、誰建立、誰呼叫誰、資料何時存在」建立因果模型，再給抽象名詞。
- 避免「JS 抓到 event」等模糊說法。優先說明：browser 建立並分派 Event，listener registration 保存 callback，browser 再呼叫 callback(event)。
- 技術翻譯需保留英文原詞並選擇符合該脈絡的繁中語意；DOM event 的 `dispatch` 採「分派」，避免誤解為網路傳送。
- Quiz 選項在 render time shuffle，避免正確答案位置形成提示。
