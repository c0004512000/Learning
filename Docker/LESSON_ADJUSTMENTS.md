# Docker Fundamentals — 教材調整指示（供 Agent 執行）

> 狀態：**已更新為七堂課調整規格；尚未套用到 HTML／課程地圖等公開教材**
>
> 記錄日期：2026-11-22
>
> Repository：`c0004512000/Learning`，主要目錄：`Docker/`
>
> 本文件是後續教材編修的工作規格，**不是給學員閱讀的講義**。不得直接把討論歷程、糾錯紀錄或 Agent 指令插入公開教材。

## 1. 變更背景與已確認的決策

目前 Session 01 由 Program/Process 直接跳到 Container，缺少部署情境至 Container 的因果橋樑。使用者已確認前兩段口頭講稿：① Program/Process → 執行環境與傳統部署；② 多服務部署時共用 VM 與分開 VM 的取捨，最後提出「不同服務要各自的執行環境，是否一定需要各自的 Guest OS／Kernel？」。目前也已同意寫入第③段 What Is a Container：從隔離性（Isolation）承接 Bridge，解釋 Linux Kernel 可為 Process 提供隔離執行環境，結尾強調 Container 不是圖中的實體小盒子，本質上仍是一個或一組受隔離機制約束的 Linux Process。第三段**已入稿但結尾措辭可繼續精簡**。第四段「What Is Docker 的開場 Bridge」也已獲確認：Container 解決隔離，但 Runtime / Dependencies / Configuration 的準備工作仍存在，進一步帶出方便、標準化的環境建構與重複使用需求，以及 Docker 的價值。**尚未確認 Dockerfile / Image / Registry 的細節教學**。目前另已確認**第一堂收尾**，重點包括 Program／Process 與 Image／Container 的有限類比、一份 Image 建立多個 Container、初步說明 Build Once, Deploy Many，以及用共用 Kernel 下的隔離問題帶入新 Session 02。**這是已核准的收尾，不代表其前面的 Dockerfile／Image／Container 正式教學及 build/run 示範已核准**。已確認的五個講述段落皆以 `Docker/TEACHING_SCRIPT.md` 為準。

**新確認的課程結構決策（2026-11-22）**：原有八堂取消獨立的 Session 02「Why Containerization?」，改為**七堂**；原 Session 03「How Containers Work」提前為新 Session 02，後續原 Session 04–08 依序前移一堂。第一堂已從傳統部署到隔離需求、再到 Docker 的動機說明基本的 Why，因此不再為 Environment Drift／Dependencies 重複安排一整堂。原 Session 02 有價值的跨環境交付概念保留但分流：第一堂介紹完 Dockerfile → Image → Container 與簡單 build/run 後，**簡短**說明同一份 Image 可用於多環境、Build Once, Deploy Many；Image Registry、Digest、細部交付差異／限制應放在後續 Image／Build 相關課程適當位置。這個**第一堂收尾現已獲確認並寫入逐字稿**；但不代表中間的 Dockerfile／Image／Container 詳細口述或示範獲准。

核心決策：

1. **Session 01 的順序調整為**：Program → Process → Execution Environment（Runtime / Dependencies / Configuration）→ 傳統部署的基本情境 → 多服務擴大時的部署選擇（共用 VM／分開 VM）→ 各方案的環境管理與維運成本取捨 → 是否一定需要獨立 Guest OS 的提問（已確認 Bridge）→ 隔離性 Isolation → What Is a Container?（已入稿、結尾可微調）→ What Is Docker? 開場 Bridge（已確認：隔離 ≠ 環境已準備好）→ Dockerfile / Image / Container（細節待確認）→ 簡單 build/run 示範 → **已確認的收尾**（Program／Process 類比 → 一份 Image 多個 Container → Build Once, Deploy Many → 第二堂 How 的提問）→ 理解驗收。
2. 先讓學員知道傳統部署如何在 Linux Server／VM 上準備執行條件；再以**共用 VM 需管理多個服務的執行環境／一服務一 VM 需維護更多 Guest OS** 這項取捨推進。VM 是合理的實務方案，並非預設每個服務一定各有一台 VM。**第一堂只用 Guest OS 數量與維護成本支撐提問，不要求學員先懂 Hypervisor，也不全面比較 VM／Container 架構**。
3. Container 的引入必須承接**已核准的部署取捨 Bridge**：服務需求不同 → 共用 VM 的環境管理取捨 → 分開 VM 的 Guest OS 維護成本 → 提問是否存在不需每組 Process 都使用獨立 Kernel 的其他方式 → 解釋真正重視的是隔離性（Isolation）→ Linux Kernel 可約束一個或一組 Process 的資源視圖／使用 → Container 定義。**不能先替學員預設「我們希望不要 Guest OS」或突然轉向 CPU／Memory／Network 隔離**；先讓取捨與成本有依據，再提出問題。結尾**才**用網路架構圖的方框破除「Container 是獨立小盒子」的錯覺，簡短強調本質上是一個或一組受到隔離機制約束的 Linux Process，避免堆疊「不是什麼、也不是什麼」的冗長尾段。**不要把「解決 Python Dependency 問題」描述成 Container 技術誕生的歷史原因**，也不要把「Image 封裝能力」誤當成 Container 的定義。
4. **先 Container，後 Docker**：前者是具有隔離邊界的執行環境；Docker 是協助建構 Image、建立與管理 Container 的工具／平台。不是所有 Container 都必須透過 Docker 建立。**已確認的 Docker 開場因果**：Linux 已能為多個服務建立 Container → 仍需準備 Runtime、Dependencies 與 Configuration → 和傳統 VM 部署一樣，環境準備及管理工作沒有自動消失 → 腳本與既有工具雖可自動化，仍有整合、標準化與重複使用的需求 → Docker 提供一致的 Image 建構與 Container 管理方式。**不得跳過這條因果鏈，直接用「要部署到另一台 Server」引出 Docker**。
5. **取消獨立 Why Containerization 堂次**：不再將 Environment Drift、Dependencies 相依衝突及 Containerization 優勢包裝成新 Session 02，避免與第一堂已完成的因果敘事重複。第一堂在 Image 基本概念之後，以**短篇幅**說明「Image 可重複交付／Build Once, Deploy Many」，不展開 Registry／Digest 或跨環境所有細節；後續 Image／Build 課再深入這些概念及限制（相同 Image 不等於所有 Runtime/Configuration/Kernel 環境相同）。
6. **新 Session 02 改為 How Containers Work**：Linux Kernel、Namespaces、cgroups、Root Filesystem、VM Guest OS vs Container 共用 Kernel 等架構與隔離界線；不要把底層實作或 VM／Container 正式架構對照塞入第一堂。
7. **七堂新順序（舊 → 新）**：原 01 → 新 01 What Is a Container & Docker?；原 02 Why Containerization? → **取消獨立章節並重新分配內容**；原 03 → 新 02 How Containers Work；原 04 → 新 03 Dockerfile & Image Layers；原 05 → 新 04 Docker Build Cache & Best Practices；原 06 → 新 05 Container Lifecycle & Storage；原 07 → 新 06 Docker Networking；原 08 → 新 07 From Docker to Kubernetes。
8. 課綱是基準，不是不可更改的鐵律。當教學連貫性與既有時間表衝突時，應調整章節段落或時間分配，**不要為了死守分鐘數而犧牲教學深度**。

## 2. 已確認內容的唯一來源

- `Docker/TEACHING_SCRIPT.md`：**已確認並同意入稿的口頭教學講稿**。目前記錄 Session 01 的開場、傳統部署 Bridge、What Is a Container、What Is Docker 開場 Bridge，**以及第一堂課的收尾（Section 05）**；第三段的結尾措辭仍可微調。
- 目前有**五段已同意入稿內容（包含已確認但須放在後面的收尾）**：`01. 開場`、`02. Bridge：從傳統部署的取捨提出問題`、`03. What Is a Container? — 隔離性與 Process 的本質`、`04. Bridge：從 Container 的隔離能力帶出 Docker`、`05. 第一堂收尾：一份 Image、多個 Container，以及第二堂的提問`。改寫時忠實保留因果順序、例子及語氣：第二段 Bridge 停在問題；第三段先說 Isolation 與 Linux 隔離能力、再定義 Container、最後強調「方框只是示意，本質上仍是一個或一組 Process」；第四段從「隔離已做到，但原本準備 Runtime / Dependencies / Configuration 的工作仍存在」帶出 Docker；**第五段在中間 Dockerfile／Image／Container 的基本講述與實作之後**，利用 Program／Process 類比總結一份 Image 可建立多個 Container，再簡短交代多環境交付，最後提問共享 Kernel 如何形成隔離，銜接新 Session 02。不得將 Container 誤說成只有單一 Process，也不得把結尾寫得冗長。第三段結尾用語仍可再修。
- 後續由口頭討論產生的新稿，**只有使用者明確確認後**，才可追加至 `TEACHING_SCRIPT.md`，且不可改動已確認段落。
- 目前使用者已同意把 Container 介紹（**可再調整結尾**）、Docker 開場 Bridge，**以及第一堂收尾**寫入 Script。**尚未確認** Dockerfile、Image、Registry、Docker 管理細節與 build/run 示範等**中間教學段落**。新七堂安排與第一堂收尾中的 Build Once, Deploy Many 簡述均已確認；不能因此推定所有中間教學已確認。

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

- 從前段已確認的 **「共用 VM／分開 VM 的部署取捨 → 是否必須各自使用 Guest OS／Kernel」** 提問承接，按照已同意入稿的第三段，先點明本來想要的是服務間的 Isolation，再說明 Linux Kernel 可對一個或一組 Process 提供檔案系統視圖、網路與資源控制等隔離，最後定義 Container。段落**結尾**再說明架構圖上的方框不代表實體小盒子；容器中的執行活動本質上仍是 Linux Process。此段已准許寫入 Script，但結尾文字仍可調整，不要以 Agent 的推測自行定稿新內容。
- 可以用兩個服務使用不同 Runtime 作為**現象／例子**，但不可把不同 Python 版本歸因於 Namespace/cgroups 本身；其檔案來源／Root Filesystem／Image 準備的機制留在後面。
- 此節不要求學員解釋 Namespace、cgroups、PID namespace、Network namespace、Filesystem 掛載的機制；如果圖示標出 Kernel，僅用於建立「不是另一套完整 OS」的基本概念，不深挖架構對照。
- 不要把 Container 簡化為「把程式與套件包起來」；封裝成可交付的 Image 是另一層概念。

**Section 03（Docker／Dockerfile／Image／Container）**

- 維持先 Container、再 Docker 的順序；明確說明 Docker 並非 Container 的同義詞或唯一實作。
- **新增已確認的 Docker 開場 Bridge（逐字稿 Section 04）**：延續同一台 Linux Server 上多個服務的部署故事。先提醒 Container 讓服務隔離、共用 Linux Kernel，不代表 Python Runtime、Dependencies、Configuration、啟動設定會自動出現；再比較以前在 VM 上部署時仍須準備執行條件，說明環境準備／管理是尚未消失的問題。承認 Shell Script、LXC Templates 等現有方法可自動化，避免宣稱沒有 Docker 就必須手動重裝。最後再提出「如何方便、標準化地描述、建構和重複使用環境」，帶出 Docker 的 Image 建構及 Container 管理價值。此處**禁止突然改談部署到其他 Server**，跨主機交付應放在 Image / Registry 後續章節中。
- Agent 應保留上述**已確認的橋樑敘事**，但 Dockerfile / Image / Registry 的詳細口頭教材尚待確認，不能擅自將構想當成已核准稿。
- 概念分工清楚：Dockerfile＝Image 的建構指示；Image＝包含檔案及設定的可重複使用建構產物；Container＝根據 Image 建立的實例（可處於 running 或 stopped）；Docker Engine＝管理相關資源的系統。
- 可把 Section 01 的部署情境接回來，讓學員理解 Dockerfile、Image 如何協助準備及重複使用已建構的內容。**第一堂收尾已確認短講 Build Once, Deploy Many**：Image 不只用於建立多個 Container，也可作為多環境的相同建構產物；只講意義、前提和基本限制，不完整展開 Environment Drift／Registry／Digest／交付工程細節。這些完整內容移至後續 Image／Build 課；正式教材需依逐字稿已確認的 Section 05 收尾編排。
- 一份 Image 可以建立多個 Container，應透過簡單示範驗證；保留 Image ≠ 正在執行的 Process 等重要區別。

**第一堂已確認收尾（逐字稿 Section 05；須在中間講解和示範之後）**

- 保留使用者特別確認的因果：**同一份 Program 能啟動多個 Process → Container 裡面執行的本質仍是 Linux Process → 同一份 Image 可以建立多個 Container**。這是理解多個執行實例的類比；不能畫上完全等號，因為 Image 含檔案系統內容／執行設定，Container 具生命週期、Writable Layer，且一個 Container 可包含一個或多個 Process。
- 明確區分 Image（不在執行的建構產物）、Container（依 Image 建立的執行實例）、Process（Linux Kernel 排程的執行單位），不能說「一份 Image 直接同時啟動多個 Process 而不經 Container」；示範多個 Container 彼此隔離，仍共享基礎 Image。
- 在同一 Image 多個 Container 的概念後，**簡短**延伸相同 Image 可跨 Development／Stage／Production 使用，點到 Build Once, Deploy Many；說明這無法保證外部環境、Configuration、Kernel 全部相同，Registry／Digest 深入細節留後續。
- **收尾最後的問題**：同一個 Linux Kernel 下，一個或一組 Process 為什麼能看到不同檔案系統／網路／資源限制？自然銜接**新 Session 02 — How Containers Work**；不要再銜接已取消的 Why Containerization。
- **順序與核准狀態**：Section 05 已確認是結尾，Section 04 與收尾之間的 Dockerfile → Image → Container 教學與 build/run 示範**尚未定稿**。請在使用者確認後補入中間段落，再按合理章次重新編號；不得直接把兩段相接，也不可宣稱第一堂內容已完整。

**Section 04–05（示範與理解驗收；既有 HTML 的舊章節標籤，須依新內容重新編排）**

- 保留最少必要的實作示範、預測／觀察／解釋與三道主要驗收題；避免變成 Docker 指令清單。
- 驗收只測本堂已教的 What 與基本執行模型：Program／Process、執行環境必要條件、Container 概念、Docker 與 Dockerfile/Image/Container 的分工、一份 Image 多實例。
- **不得要求回答 Linux 隔離是如何實作的**，也不要拿同一份 Image 對比出 Namespace、cgroups 的底層細節。

**時間與 UI**

- 現有 00–07、07–14、14–22、22–27、27–30 是舊版時間配置。加入傳統部署背景後，應重新估算每節時間，仍以約 30 分鐘為目標；必要時可以延長或拆分，不要機械壓縮內容。
- 保留已有的插圖／互動題／導覽與 GitHub Pages 連結；如內容順序變動，更新導覽、圖說、速查與題目對應。
- 沿用 `Docker/assets/style.css` 等現有 @lfd 風格資產，深色優先、手機可讀，不臨時另造一套 CSS。

### B. 原 `Docker/lessons/0002-why-containerization.html` 與新 Session 02（**課程重整，不再作為 Why 堂次**）

- 原 `0002-why-containerization.html` 是**既有已撰寫的舊版 HTML**；取消其獨立堂次**不等於立即刪掉檔案**。實際重編、封存／重新導向、修正連結以前，須明確標示舊教材狀態，避免 GitHub Pages 上把舊頁當成新的第二堂。
- 新 Session 02 為 **How Containers Work**，從第一堂「Container 仍是 Process／共用 Linux Kernel」承接，真正拆解 Namespaces、cgroups、Root Filesystem，以及 VM／Container 架構與安全隔離邊界。
- 從舊 Why HTML 萃取而非照搬有價值內容：第一堂用簡短例子帶出同一 Image 多環境交付與 Build Once, Deploy Many；Registry、Digest、相同 Artifact 但不同環境的限制，可排在新 Session 03「Dockerfile & Image Layers」或合適的後續 Image／Build 小節，避免另開一堂只是重述優點。
- 保留 VM Image、Configuration Management、venv 等替代方案的平衡觀點；不得宣稱 VM 不能部署或使用 Docker 就保證完整環境一致。
- 不要在尚未正式修改 HTML 時宣稱舊 Session 02 已完成遷移或新 Session 02 已發佈。

### C. `Docker/learning-map/index.html`、`Docker/MISSION.md`、`Docker/NOTES.md`（維護一致性）

- 更新 Session 01 摘要／課前知識依賴路線：Program → Process → 執行條件／傳統部署情境 → Container → Docker。
- `MISSION.md` 既有「不可在尚未解釋 Container 前突然討論 VM」應改得更精確：**可以在第一堂以 Linux Server／VM 作為熟悉的部署情境，但在未介紹 Container 前，不得要求學員理解 VM 架構或直接比較 VM 與 Container**。
- 更新 Notes／Mission，改成 **七堂**與新的第一、二堂分工；不要讓舊的「第一堂完全不提 VM」規則或舊 Why 專章與新決策矛盾。
- 更新完整 Learning Map 與所有 Session 標籤、數量、導覽、上一堂／下一堂及狀態：舊 03–08 依序改成新 02–07；不要只修改標題卻遺留八堂計數、舊 Session 02 HTML 連結、`0/8` 或過時的路線說明。
- 新 Session 02 及新 03–07 **規劃中，尚未正式撰寫或驗收**；既有 `0001`／舊 `0002` HTML 仍屬舊教材，需另行完成重編與發佈驗證。更新規劃檔不等於改好公開課程頁。

## 4. 避免的錯誤敘事

- ❌ 「傳統部署就是每次新建 VM，直接複製 app.py 會失敗。」
  - ✅ 部署可使用現有或新 VM，需準備執行條件；單純複製程式碼**不能保證**成功。
- ❌ 「Container 被發明是為了解決 Python Dependencies 問題。」
  - ✅ 以 Process 隔離與環境管理引入 Container；稍後用 Image/Docker 解釋應用程式交付。
- ❌ 「Container 就是包好的所有依賴」、「Docker 就是 Container」。
  - ✅ 明確區分隔離執行環境、Image 建構產物，以及管理工具。
- ❌ 一講到 Process 或 Dependencies 就突然問「我們是不是希望不需要 Guest OS？」或硬切入 Namespace/cgroups／CPU/Memory 隔離。
  - ✅ 先說明共用 VM 的環境管理取捨與分開 VM 的維運成本，再提出 Guest OS 必要性的問題。新第一堂整合必要的 What／Why，第二堂專注 How Containers Work。
- ❌ 在介紹 Docker 的第一句就跳到「把 Image 部署到另一台 Server」，忽略同一台 Server 上建立 Container 後仍需準備環境的問題。
  - ✅ 先從已知的隔離能力切入未解決的 Runtime、Dependencies、Configuration 準備工作，讓重複使用與標準化需求自然浮現；跨 Server 交付屬後續延伸。
- ❌ 刪除 Why Containerization 堂次後，把 Image 交付一致性、Build Once, Deploy Many、Registry／Digest 等有價值概念一併刪掉，或在第一堂重新塞入整套 Why 內容。
  - ✅ 第一堂只簡介核心的多環境交付價值；深入的 Image 交付、Digest 與限制分配到後續 Image／Build 章節。
- ❌ 課綱改成七堂，但沿用舊的八堂導覽、編號、連結或「第二堂 Why Containerization」說法。
  - ✅ 依七堂對應表同步處理公開頁面及課程進度；舊 HTML 在遷移完成前須正確標示其狀態。
- ❌ 為了迎合既有課綱而快速略過必要的例子與因果。
  - ✅ 以學員能理解、能推論為第一優先，必要時調整課綱。

## 5. 執行次序與驗收門檻

1. 先閱讀 `TEACHING_SCRIPT.md`、`MISSION.md`、`NOTES.md`、Session 01/02 HTML 與 Learning Map，確認沒有新版本或後續已核准稿。
2. 先依已確認的**開場、部署 Bridge、What Is a Container、Docker 開場 Bridge、第一堂收尾**五段提出 Session 01 改寫草案。第三段已准許入稿、**結尾可微調**；第四段只涵蓋 Docker 的價值與銜接；第五段是已確認的**結尾**，**前面仍缺 Dockerfile／Image／Container 詳細講述和 build/run 示範**。不得把已確認的收尾錯放到 Docker 的開場 Bridge 後面，也不可替未核准中間段落標記為確認。
3. 對照第一堂新增的**部署取捨橋樑**與七堂新結構，確認沒有獨立 Why 專章；新第二堂直接講 How Containers Work（Linux 隔離與 VM 架構比較）；新第三堂起再深入 Dockerfile／Image Layers／交付相關技術。同步規劃 Course Map、Notes、Mission 與所有導覽連結的更新；保持從已知部署情境到新概念的因果順序。
4. 檢查技術正確性、互動功能、連結、手機版排版、CSS 與可讀性；若實際變更 HTML，才在測試與驗證後更新對外教材的完成狀態。
5. **本檔案改為七堂課調整規格，不代表已經修改或發佈 HTML，也不代表 Session 01 已正式理解驗收。** 既有網站目前仍可能記載舊八堂「已撰寫 Session 01–02／正式驗收 0/8」，那是**尚待遷移的舊版狀態**，不得把舊 HTML 的完成數直接算成新七堂已完成／已驗收；正式變更後需重算並提供真實狀態。

## 6. 後續維護方式

- 已獲使用者確認的**講課逐字稿**：追加到 `Docker/TEACHING_SCRIPT.md`。
- 因討論而確認的**教材結構／內容變更**：同步更新本檔案，註明影響章節、修正原因與具體驗收準則。本次（2026-11-22）已確認傳統部署 Bridge、同意加入 What Is a Container、確認 Docker 開場 Bridge、**確認第一堂收尾**，並確定八堂改七堂、取消 Why Containerization 獨立堂次；不得只更新逐字稿而讓 Agent 指示沿用舊編排、錯誤過渡或跳到跨主機部署，也不可忽略第三段結尾需精簡的回饋。
- 未經確認的教學建議，應明確標示「提案／待確認」，不可寫成既定決策。
- 當使用者明確要求更新現有 GitHub Pages 教材時，再依本檔案實作 HTML/課程地圖/必要參考頁，並核對實際 commit/頁面狀態。
