# Lesson 04 — Learning-from-docs Revision QA（2026-11-09）

## Scope
- 來源：2026-11-08/09 Lesson 04 對話的理解缺口；教學需求以概念依賴重整，不直接搬運對話問句當 Heading。
- Mission：Community Build 的可維運品質檢查與 CI/CD Gate 策略；未擴張為商業版功能或已部署的 Production Gate。
- Canonical Skill：Learning/Learning-from-docs/SKILL.md 與 upstream teach、OPTIMIZED-DELTA、LEARNING-MAP、教學／呈現／技術偏好均於本次讀取。
- 已修改：Lesson 04、Reference 0004、Glossary、RESOURCES、Learning Map L04 來源／目標／驗收、NOTES；新建 Evidence。
- **Learning Records**：沒有因本次答問片段建立通過紀錄；Learning Map 維持 0 / 14 完整驗收。

## Cold-read / Blank-slate audit
- 從規則庫與內建 Profile 的關係開始 → Rule／Issue → 專案按語言選 Profile → Gate 指標集合 → 新規則來源／Metadata → 固定 New Code 基準與持續 CI 掃描 → Coverage 與阻擋。
- 對話中「Root Path」僅作曾經的實例，不是 Mission 所必要的新 Lesson 標題；主線採可移植的合成 A/B/C 分析基準案例。
- Main Lesson 保留核心與兩題互動理解檢查；XPath、Java Plugin、External Analyzer、Metadata 修改邊界、Specific analysis 設定細節放 Reference，並有 Lesson↔Reference 回程連結。
- 言明 Community Build Specific analysis 目前官方只支援 Web API 選既有分析；不把 Git SHA、任意未來時間誤作 UI 參數。
- Coverage 缺報告不直接等同 Gate 必然 FAIL；依官方 Metrics / Fudge Factor / 覆蓋行數與版本核對。

## 靜態測試結果（已執行）
- 讀回四個 GitHub HTML：Lesson 04、Reference 0004、Glossary、Course Map。
- 解析上述四個頁面的相對連結，共 **66** 個；均有已知、已驗證的 repo 內目的路徑，Reference 本頁的段落錨點與 Lesson 04 互連均可解析。
- HTML 主結構的 html/body/main/section/details/fieldset 開關標籤數量一致。
- Lesson 04 共 **2** 題 `data-quiz`，都有 data-correct、獨立 radio name，以及 JavaScript 關閉時的 `noscript > details` 解析；現有 assets/site.js 針對每個 data-quiz 啟用按鈕與答案回饋，未新增無作用的控制項。
- 未新增公司內部 host、私有 repo、token、內部工作流程內容或虛構 UI 螢幕截圖。

## 待驗證／不能宣稱成功
- GitHub Pages 的公開網站地址在本次網頁存取工具無法讀取；未做實際 Browser DOM / JavaScript 操作、390px 手機橫向溢位與桌面 viewport QA。
- 因此僅可宣稱 **GitHub 原始檔已更新、靜態結構／連結檢查通過**；不能宣稱 production Pages 完整驗證。
- 尚需在核准的 SonarQube 版本檢查 Specific analysis API、Rule Metadata UI 編輯範圍、Coverage 報告、Gate PASS/FAIL 及 CI 的 downstream dependency。
