# Docker Fundamentals — 教材調整指示（供 Agent 執行）

> 狀態：**已建立調整規格；尚未套用到 HTML 教材**
>
> 記錄日期：2026-11-22
>
> Repository：`c0004512000/Learning`，主要目錄：`Docker/`
>
> 本文件是後續教材編修的工作規格，**不是給學員閱讀的講義**。不得直接把討論歷程、糾錯紀錄或 Agent 指令插入公開教材。

## 1. 變更背景與已確認的決策

目前 Session 01 由 Program/Process 直接跳到 Container，缺少部署情境至 Container 的因果橋樑。使用者已確認兩段口頭講稿：① Program/Process → 執行環境與傳統部署；② 多服務部署時共用 VM 與各自使用 VM 的取捨，最後提出「不同服務要各自的執行環境，是否一定需要各自的 Guest OS／Kernel？」。兩段均以 `Docker/TEACHING_SCRIPT.md` 為準，Container 的正式定義與後續講述仍未確認。

核心決策：

1. **Session 01 的順序調整為**：Program → Process → Execution Environment（Runtime / Dependencies / Configuration）→ 傳統部署的基本情境 → 多服務擴大時的部署選擇（共用 VM／分開 VM）→ 各方案的環境管理與維運成本取捨 → 是否一定需要獨立 Guest OS 的提問（已確認 Bridge）→ What Is a Container?（待確認）→ What Is Docker? → Dockerfile / Image / Container → 示範與理解驗收。
2. 先讓學員知道傳統部署如何在 Linux Server／VM 上準備執行條件；再以**共用 VM 需管理多個服務的執行環境／一服務一 VM 需維護更多 Guest OS** 這項取捨推進。VM 是合理的實務方案，並非預設每個服務一定各有一台 VM。**第一堂只用 Guest OS 數量與維護成本支撐提問，不要求學員先懂 Hypervisor，也不全面比較 VM／Container 架構**。
3. Container 的引入必須承接**已核准的部署取捨 Bridge**：服務需求不同 → 共用 VM 的環境管理取捨 → 分開 VM 的 Guest OS 維護成本 → 提問是否存在不需每組 Process 都使用獨立 Kernel 的其他方式。**不能先替學員預設「我們希望不要 Guest OS」或突然轉向 CPU／Memory／Network 隔離**；先讓取捨與成本有依據，再提出問題。**不要把「解決 Python Dependency 問題」描述成 Container 技術誕生的歷史原因**，也不要把「Image 封裝能力」誤當成 Container 的定義。
4. **先 Container，後 Docker**：前者是具有隔離邊界的執行環境；Docker 是協助建構 Image、建立與管理 Container 的工具／平台。不是所有 Container 都必須透過 Docker 建立。
5. **Session 02 保留深入部署面的 Why**：Environment Drift、相依衝突、建構／部署重複組裝、CI 建構同一份 Image Artifact、Registry、Tag/Digest、部署設定與執行環境仍可能不同，以及限制與替代方案。第一堂只建立基本情境，避免提前講完整套 Why。
6. **Session 03 保留架構面的 How**：Linux Kernel、Namespaces、cgroups、Root Filesystem，正式比較 VM／Guest OS 與 Container／共享 Host Kernel 的隔離架構；不要把底層實作解釋／驗收塞入第一堂。
7. 課綱是基準，不是不可更改的鐵律。當教學連貫性與既有時間表衝突時，應調整章節段落或時間分配，**不要為了死守分鐘數而犧牲教學深度**。

## 2. 已確認內容的唯一來源

- `Docker/TEACHING_SCRIPT.md`：**已確認的口頭教學講稿**。目前只記錄 Session 01 從開場到「What Is a Container?」前的段落。
- 目前有**兩段已確認內容**：`01. 開場` 與 `02. Bridge：從傳統部署的取捨提出問題`。改寫第一堂時應忠實保留其因果順序、例子及語氣，不得擅自把它縮成「搬檔案會失敗」或「多個 Process 需要隔離」兩句話。Bridge 應停在問題，下一節 Container 定義仍待使用者核准。
- 後續由口頭討論產生的新稿，**只有使用者明確確認後**，才可追加至 `TEACHING_SCRIPT.md`，且不可改動已確認段落。
- 目前使用者**尚未確認** Container、Docker、Dockerfile、Image 等後續段落的最終逐字稿。這份調整規格不構成對那些後續逐字稿的核准。

## 3. 對現有檔案的具體編修要求

### A. `Docker/lessons/0001-what-is-container-docker.html`（主要修改對象）

**Section 01（現行「FROM CODE TO PROCESS」）**

- 維持 Program vs Process 的基礎定義與一份程式可啟動多個 Process 的例子。
- 參照 `TEACHING_SCRIPT.md`，延伸具體情境：本機 FastAPI 可以運作 → 要部署到 Linux Server／既有或新建 VM → 準備 Python Runtime、套件 Dependencies、環境變數與設定 → 才能啟動服務。
- 強調：「Application Code 不等於完整的 Execution Environment」；這是對執行條件的認識，不是宣稱傳統部署一定失敗。
- 清楚說明：VM 可正常部署應用程式；工程師也能使用部署腳本或 Configuration Management 自動化，不要寫成「傳統部署每次都重建 VM」或「VM 做不到」。
- **新增已確認的 Bridge（須參照逐字稿完整保留推進順序）**：一支 API 在 VM 上正常部署 → 十個不同需求的服務 → 可以共用一台 VM，也可以分開部署到不同 VM → 共用方式要管理版本與環境相互影響，分開方式有更多 Guest OS 要更新、修補、配置與維護 → 兩種方案各有取捨 → 才問「為了各自的執行環境，是否每次都需要完整 Guest OS？有無共用 Kernel 但提供相對獨立環境的方式？」。不可把這段縮成突兀的資源隔離提問。
- 現有程式／示意圖可保留或調整，但須與新的講述順序一致；如果改圖，圖上要能區分 Code、Runtime、Dependencies、Configuration、Process。
- 原 Section 01 結尾只問「三份 app.py 是否對應三個 Process」過於單薄；保留該題作初階檢查，另可增加「程式碼相同是否保證兩台主機執行條件相同？」的情境推理題，答案由前文可推得，不要求後續技術知識。

**Section 02（現行「Container：讓程式在有邊界的環境裡執行」）**

- 從前段已確認的 **「共用 VM／分開 VM 的部署取捨 → 是否必須各自使用 Guest OS／Kernel」** 提問承接，再規劃 Container 與一般 Process 的關係與隔離執行環境的定義。**此 Section 的口頭講述尚未核准，Agent 不得自行認定已定稿**；不可省略部署取捨，直接跳到資源隔離。
- 可以用兩個服務使用不同 Runtime 作為**現象／例子**，但不可把不同 Python 版本歸因於 Namespace/cgroups 本身；其檔案來源／Root Filesystem／Image 準備的機制留在後面。
- 此節不要求學員解釋 Namespace、cgroups、PID namespace、Network namespace、Filesystem 掛載的機制；如果圖示標出 Kernel，僅用於建立「不是另一套完整 OS」的基本概念，不深挖架構對照。
- 不要把 Container 簡化為「把程式與套件包起來」；封裝成可交付的 Image 是另一層概念。

**Section 03（Docker／Dockerfile／Image／Container）**

- 維持先 Container、再 Docker 的順序；明確說明 Docker 並非 Container 的同義詞或唯一實作。
- 概念分工清楚：Dockerfile＝Image 的建構指示；Image＝包含檔案及設定的可重複使用建構產物；Container＝根據 Image 建立的實例（可處於 running 或 stopped）；Docker Engine＝管理相關資源的系統。
- 可把 Section 01 的部署情境接回來，讓學員理解 Dockerfile、Image 如何協助準備及重複使用已建構的內容，但**不要在這一堂完整展開 Environment Drift／Build Once／Registry／Digest**。
- 一份 Image 可以建立多個 Container，應透過簡單示範驗證；保留 Image ≠ 正在執行的 Process 等重要區別。

**Section 04–05（示範與理解驗收）**

- 保留最少必要的實作示範、預測／觀察／解釋與三道主要驗收題；避免變成 Docker 指令清單。
- 驗收只測本堂已教的 What 與基本執行模型：Program／Process、執行環境必要條件、Container 概念、Docker 與 Dockerfile/Image/Container 的分工、一份 Image 多實例。
- **不得要求回答 Linux 隔離是如何實作的**，也不要拿同一份 Image 對比出 Namespace、cgroups 的底層細節。

**時間與 UI**

- 現有 00–07、07–14、14–22、22–27、27–30 是舊版時間配置。加入傳統部署背景後，應重新估算每節時間，仍以約 30 分鐘為目標；必要時可以延長或拆分，不要機械壓縮內容。
- 保留已有的插圖／互動題／導覽與 GitHub Pages 連結；如內容順序變動，更新導覽、圖說、速查與題目對應。
- 沿用 `Docker/assets/style.css` 等現有 @lfd 風格資產，深色優先、手機可讀，不臨時另造一套 CSS。

### B. `Docker/lessons/0002-why-containerization.html`（檢查銜接，不重寫主題）

- 檢查第二堂開頭是否能明確接住第一堂：學員已知道 Program／Process、執行環境與 Container/Docker/Image 的基本定義。
- 原本的「同程式碼、不同環境」案例可保留；第二堂應從根因和部署流程的工程取捨**深入**，而不是重複第一堂對 Runtime／Dependencies 的定義。
- 保留「每個部署環境各自組裝」對比「CI build Image → Registry → 相同 Artifact 部署」以及同 Digest／不同環境的限制。
- 原教材已提到 VM 與 venv 也是替代方案、Container 不保證 VM 等級的隔離；保留這種平衡，將正式架構比較導向 Session 03。

### C. `Docker/learning-map/index.html`、`Docker/MISSION.md`、`Docker/NOTES.md`（維護一致性）

- 更新 Session 01 摘要／課前知識依賴路線：Program → Process → 執行條件／傳統部署情境 → Container → Docker。
- `MISSION.md` 既有「不可在尚未解釋 Container 前突然討論 VM」應改得更精確：**可以在第一堂以 Linux Server／VM 作為熟悉的部署情境，但在未介紹 Container 前，不得要求學員理解 VM 架構或直接比較 VM 與 Container**。
- 更新 Notes，記錄第一堂的橋梁與第二／三堂分工；不要讓舊的「第一堂完全不提 VM」規則與新決策矛盾。
- 若調整 Session 01 時間或各堂介紹句，Course Map／課程入口／速查頁應同步檢查。

## 4. 避免的錯誤敘事

- ❌ 「傳統部署就是每次新建 VM，直接複製 app.py 會失敗。」
  - ✅ 部署可使用現有或新 VM，需準備執行條件；單純複製程式碼**不能保證**成功。
- ❌ 「Container 被發明是為了解決 Python Dependencies 問題。」
  - ✅ 以 Process 隔離與環境管理引入 Container；稍後用 Image/Docker 解釋應用程式交付。
- ❌ 「Container 就是包好的所有依賴」、「Docker 就是 Container」。
  - ✅ 明確區分隔離執行環境、Image 建構產物，以及管理工具。
- ❌ 一講到 Process 或 Dependencies 就突然問「我們是不是希望不需要 Guest OS？」或硬切入 Namespace/cgroups／CPU/Memory 隔離。
  - ✅ 先說明共用 VM 的環境管理取捨與分開 VM 的維運成本，再提出 Guest OS 必要性的問題。第一堂重 What，第二堂重 Why，第三堂重 How。
- ❌ 為了迎合既有課綱而快速略過必要的例子與因果。
  - ✅ 以學員能理解、能推論為第一優先，必要時調整課綱。

## 5. 執行次序與驗收門檻

1. 先閱讀 `TEACHING_SCRIPT.md`、`MISSION.md`、`NOTES.md`、Session 01/02 HTML 與 Learning Map，確認沒有新版本或後續已核准稿。
2. 先依已確認的開場**及 Bridge** 提出 Session 01 改寫草案。**Bridge 已核准、What Is a Container 的講述未核准**；若要整體重寫，應區分「已確認逐字稿」與「Agent 建議的待核准內容」，不得替未核准內容標記為確認。
3. 對照第一堂新增的**部署取捨橋樑**，檢查第二堂是否重複、第三堂保留何種比較；同步維護 Course Map/Notes/Mission。Section 01/02 的教材過渡必須能從部署情境推導出問題，避免跳接。
4. 檢查技術正確性、互動功能、連結、手機版排版、CSS 與可讀性；若實際變更 HTML，才在測試與驗證後更新對外教材的完成狀態。
5. **本檔案本身的建立，不代表已經修改或發佈 HTML、也不代表 Session 01 已正式理解驗收。** 原課程目前記載「已撰寫 Session 01–02，正式驗收 0/8」，不可擅自提升狀態。

## 6. 後續維護方式

- 已獲使用者確認的**講課逐字稿**：追加到 `Docker/TEACHING_SCRIPT.md`。
- 因討論而確認的**教材結構／內容變更**：同步更新本檔案，註明影響章節、修正原因與具體驗收準則。本次（2026-11-22）新增的 Bridge 為已確認內容，不應只更新逐字稿而讓 Agent 指示沿用舊的隔離切入點。
- 未經確認的教學建議，應明確標示「提案／待確認」，不可寫成既定決策。
- 當使用者明確要求更新現有 GitHub Pages 教材時，再依本檔案實作 HTML/課程地圖/必要參考頁，並核對實際 commit/頁面狀態。
