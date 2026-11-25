# Docker Fundamentals — 教材調整指示（供 Agent 執行）

## 2026-11-25 — 2.1 原圖 PNG 完整同步（最高優先級）

- `Docker/assets/diagrams/02b_container_execution_environment_dark.png` 是**對話內已核准的圖片原檔**，已完整上傳至 GitHub，不是 SVG 重繪版本。此圖片畫面包括四個英文標籤 Configuration、Dependencies、Code、Runtime，以及正面標示 Container 的開口紙箱；**恰好四條箭頭**。此版僅修改 Runtime Engine 標籤為 Runtime，保留原本配置。
- `Docker/TEACHING_SCRIPT.md` 的 2.1 結尾必須直接引用此 PNG 相對路徑。舊檔 `02b_container_execution_environment_dark.svg` 不再作為教材圖資使用；不可改回 SVG，也不可未經同意另外重畫版面；目前正式標籤為 Runtime。
- 保持學員版圖片原貌；GitHub 完成狀態不等於 HTML 同步，後續改版 HTML 時需確認圖片路徑。


> 狀態：**Lesson 01 已依四個 Chapter／十三個 Section 更新逐字稿。全套規劃七堂 Lesson；正式 HTML、Learning Map 與圖資仍須另行驗證／更新。**
>
> 最近修訂：2026-11-25（2.1 正式 PNG 僅將 Runtime Engine 標籤改為 Runtime；已同步 GitHub）
>
> Repository：`c0004512000/Learning`，主要目錄：`Docker/`
>
> 本文件是後續教材編修的工作規格，**不是給學員閱讀的講義**。不得直接把討論歷程、糾錯紀錄或 Agent 指令插入公開教材。

## 2026-11-25 — 2.1 新圖與 3.4 One Image → Multiple Containers（優先適用）

- **2.1 正式圖 `02b_container_execution_environment_dark.png`**：**以對話中使用者認可的生成圖片原檔為唯一正式版本**。Configuration、Dependencies、Code、Runtime 四個圖示依原構圖匯入開口紙箱，紙箱正面標示 Container；保持四條箭頭、暗色系及英文標籤，不以另外重繪的 SVG 取代。此圖已在 GitHub 上傳原始 PNG 位元組，並由 Teaching Script 的 2.1 結尾引用。
- **3.4 現有圖 `04_dockerfile_image_container_flow_dark.svg`**：一份 Dockerfile Build 一份唯讀 Image，同一 Image 分叉建立 **Container A／B／C**，每個 Container 有自己的 **Main Process A／B／C**。箭頭須真正連接每個 Container；不暗示每個 Container 只能有單一 Process，或各有獨立 Linux Kernel。
- **視覺規格**：沿用深色底、藍色 Dockerfile、綠色 Image、紫色 Container；圖片內只用英文技術標籤，不加教學旁白。SVG 位於 `Docker/assets/diagrams/`，以 Markdown 相對路徑嵌入 `TEACHING_SCRIPT.md`；HTML 尚未修改。
- **實際狀態**：兩張 SVG 已在 GitHub 提交；Teaching Script 已新增 2.1 圖片並沿用 3.4 原圖片路徑。兩份 MD 會持續記錄圖資規格與核准狀態。

## 2026-11-25 — 講稿自然銜接與圖片去噪修正（最高優先級）

- **Section 1.1（Program → Process）**：直接從 `app.py` 是靜態程式內容，到使用 `python app.py` 產生 Process，接著以「同一份程式可以再次執行，形成不同執行實例」自然帶出多個 Process。**不可突然補一句『每個 Process 有各自的 PID／記憶體空間』當作知識跳躍；若沒有對應教學需求，就不在此處加 PID／Memory 的細節。**
- **Section 1.3（VM Trade-offs）**：共用 VM vs 各自 VM 的成本與風險比較完成後，僅提出一個**以問題為中心**的過渡：「為了讓服務互不干擾，是否一定要為每個服務維護獨立 Guest OS？」**不提前提到 Kernel**，不在此處要求學員理解共享 Kernel 或隔離實作。
- **Section 2.1（Why Isolation Matters）**：**直接回答 1.3 的問題**，用服務更新套件／改設定／消耗資源等具體例子引出「避免彼此干擾」的隔離需求，然後定義 Isolation。禁止再重複「我們先想想為什麼需要各自 VM」或再次回溯上一章已經講完的部署取捨。
- **Section 2.2（What Is a Container?）**：為了解釋同一台 Linux Host 如何做到隔離，才先介紹 Kernel：「Linux 作業系統的核心，負責管理 Process 與系統資源」。此時才講 Kernel 可以透過 Linux 機制隔離 Process 的資源視圖／使用，並定義 Container。**不能在 Chapter 1 先提未定義的 Kernel 再拖到 Chapter 2 解釋**。
- **五張圖片（全面修訂）**：保留 Dark Mode、藍／綠／紫／黃的色調邏輯；圖片內的可見文字 **一律使用英文（English only）**，不放繁體中文或簡體中文。只畫必要的程式與實例關係、部署選擇、VM／Container 架構、Dockerfile → Image → Container 與 Image 重複使用；**一律移除講師旁白、觀眾提醒、圖示插入說明、對圖本身的評語、長篇 takeaway 文字**。例如「聽者容易卡住的點」「這張圖適合放在哪裡」「一句話版本」都不可出現在圖片內。
- **GitHub 目前實際狀態**：已直接更新 `Docker/TEACHING_SCRIPT.md` 的 1.1／1.3／2.1／2.2；五張 English-only Dark Mode SVG 已覆寫至 `Docker/assets/diagrams/` 原路徑。Markdown 的相對圖片連結保持不變。正式 HTML、Learning Map 與 Docker 實機驗證不在本次更新範圍。
- **驗收規則**：講稿逐章檢查問題與答案是否在相鄰小節順暢銜接；圖片驗收要確認可見文字只有英文技術標籤、沒有課程旁白，而且沒有因為精簡而畫錯 Kernel／Guest OS／Image／Container 的技術層級。

## 2026-11-24 — Lesson／Chapter／Section 與視覺化規格（優先適用）

### 命名與標題層級
- **Course：Docker Fundamentals**。全套規劃七個 Lesson。**Lesson 01：Introduction to Containers & Docker**。
- 一個 **Lesson** 可以包含多個 **Chapter**；每個 Chapter 底下再有若干 **Section**，編號為 `1.1`、`1.2`、`2.1` 等。**Section 下不得再有教學用的第三層小標題**。
- Markdown 對應：`# Course` → `## Lesson` → `### Chapter` → `#### Section`。課程概念是 Lesson → Chapter → Section，並非「一個 Lesson 等於一個 Chapter」。
- 本次已將 `Docker/TEACHING_SCRIPT.md` 從舊 01–08 **八段連號**重整為以下 **四個 Chapter、十三個 Section**；原先核准的講述內容、Dockerfile、CLI 示範與結尾均保留，僅重整標題及段落歸屬。

### Lesson 01 正式編排

| Chapter | Section | Title | 對應實際內容、銜接目標 |
|---|---|---|---|
| **1 — From Program to Deployment** | 1.1 | Program vs Process | 靜態 Program → 執行中的 Process；為 Image／Container 類比打底 |
| | 1.2 | Application Execution Environment | FastAPI 的 Runtime、Dependencies、Configuration；從執行到部署 |
| | 1.3 | Traditional Deployment & VM Trade-offs | 共用 VM vs 分開 VM 的取捨；只問服務互不干擾是否一定要維護獨立 Guest OS，不預告 Kernel |
| **2 — Understanding Containers** | 2.1 | Why Isolation Matters | 直接回答上節，不重新回顧 VM 取捨；用環境變更／資源競爭例子定義 Isolation |
| | 2.2 | What Is a Container? | 首次解釋 Kernel 是管理 Process／資源的作業系統核心，再說明隔離能力及 Container 的 Process 本質 |
| | 2.3 | VM vs Container | VM 各自 Guest OS／Kernel vs Container 共用 Host Kernel；不深入實作 |
| **3 — Understanding Docker** | 3.1 | Why Docker? | 隔離不能自動準備 Runtime／Dependencies；帶出 Docker |
| | 3.2 | Dockerfile — Defining the Environment | Dockerfile 描述建構環境；`FROM`、`COPY`、`RUN`、`CMD` 等基本用途 |
| | 3.3 | Docker Image — The Build Artifact | Build 產出含檔案系統內容／執行設定的唯讀 Image，非執行中 Process |
| | 3.4 | Docker Container — Running the Application | Run 以 Image 建立 Container；對照 Build 階段與啟動階段 |
| **4 — Hands-on & Key Takeaways** | 4.1 | Building a Docker Image | 完整三份範例檔案，`docker build`、`docker image ls` |
| | 4.2 | Running Multiple Containers | 同 Image 啟動 api-a／api-b、Port Mapping、HTTP 驗證、`docker ps` 與清理 |
| | 4.3 | Putting It All Together | Program／Process 類比、多 Container、Build Once, Deploy Many 與自然總結 |

### 視覺化資源插入規劃

| GitHub 圖資（Dark Mode SVG，目錄 `Docker/assets/diagrams/`） | Section | 插入時機 |
|---|---|---|
| [`01_program_vs_process_dark.svg`](assets/diagrams/01_program_vs_process_dark.svg) | 1.1 | 說明一份 Program 可產生多個 Process |
| [`02_shared_vm_vs_many_vms_dark.svg`](assets/diagrams/02_shared_vm_vs_many_vms_dark.svg) | 1.3 | 比較共用一台 VM／一服務一台 VM 的維運取捨 |
| [`02b_container_execution_environment_dark.png`](assets/diagrams/02b_container_execution_environment_dark.png) | **2.1 結尾** | 使用者核准之 Dark Mode PNG（Runtime 標籤版）；Configuration／Dependencies／Code／Runtime 各一條箭頭匯入 Container 開口紙箱 |
| [`03_vm_vs_container_architecture_dark.svg`](assets/diagrams/03_vm_vs_container_architecture_dark.svg) | 2.3 | 定義 Container 之後，對照 Guest Kernel 與共享 Host Kernel |
| [`04_dockerfile_image_container_flow_dark.svg`](assets/diagrams/04_dockerfile_image_container_flow_dark.svg) | 3.4 | Dockerfile → one Image → Container A／B／C；各有獨立 Main Process，不代表容器僅能有單一 Process |
| [`05_build_once_run_many_deploy_many_dark.svg`](assets/diagrams/05_build_once_run_many_deploy_many_dark.svg) | 4.3 | 兩個 Container 的示範結束後，呼應收尾概念 |

- **Teaching Script 圖片標記規格**：在正文的對應段落插入 `<!-- 圖 XX｜Section X.X｜Dark Mode｜插入時機：... -->` 註解，緊接著使用 `![替代文字](assets/diagrams/檔名.svg)`，讓 GitHub 閱讀模式可直接看圖、原始碼仍可辨識教學插入點。註解不是講者要唸出的口語內容。
- **視覺要求**：維持既有的藍、綠、紫、黃意義與配色，改用深色底／高對比，支援投影與桌面閱讀；**圖面只用英文技術標籤，不得出現中文或講者旁白**。不得包含「聽者容易卡住」「此圖放在哪裡」「一句話版本」等非技術內容；檢查文字大小、線路箭頭及 VM／Container／Image 的技術正確性。
- **資產狀態（2026-11-25 已上傳）**：六張 Dark Mode 圖（五張 SVG、一張 PNG） 已存在 GitHub `main` 的 `Docker/assets/diagrams/`，且 `Docker/TEACHING_SCRIPT.md` 在 1.1／1.3／2.1／2.3／3.4／4.3 的講稿正文直接嵌入圖片。若要放進不同目錄的正式 HTML，須調整相對 URL 並實測渲染；不代表 HTML 已完成。
- **語意驗收**：每一個 Chapter 都應有獨立學習目的；每一個 Section 的 Title 必須與實際內容相符。按「問題 → 回答 → 下一個必要問題」編排，而非平均切分字數；不硬加「現在進入第二章」「下一堂會談」等口頭預告。
- **深度界線**：Image 的靜態本質可在第一堂簡介；Image Layers、OCI、Namespaces／cgroups、BuildKit 等底層細節留給適合的主題。不得為了新標題重寫或刪除已確認講稿。
- **進度區分**：兩份 Markdown、六張 Dark Mode 圖（五張 SVG、一張 PNG） 的 GitHub 上傳與 Teaching Script 圖片嵌入均已完成；正式 HTML／Learning Map、Docker 實機驗證及全堂試講仍未完成。

## 2026-11-24 補充決議：第一堂 Dockerfile／Image／Container 講稿及實作已核准（優先適用）

- 使用者確認納入完整 **Dockerfile → Image → Container** 基本教學（逐字稿 3.2–3.4），以及可複製操作的 **build/run 最小實作示範**（4.1–4.2）。原第一堂收尾位於 **4.3**；原八段內容已整理為四個 Chapter／十三個 Section。
- 此次新段落不是只有 Command List，而是延續一開始的 Python API：準備 Runtime／Dependencies → 用 Dockerfile 描述環境 → `docker build` 產生 Image → Image 的本質是唯讀、可重用的檔案系統內容與執行設定（不執行 Process、不包含獨立 Kernel）→ `docker run` 建立及啟動 Container → 程式真正以 Linux Process 運作。
- 必須呈現最小範例三個檔案：`app.py`（FastAPI `GET /` 回傳 `{"message":"Hello Docker"}`）、`requirements.txt`（`fastapi`／`uvicorn`）、`Dockerfile`（`FROM python:3.12-slim`、`WORKDIR /app`、`COPY`、`RUN pip install`、`CMD` 使用 Uvicorn 監聽 `0.0.0.0:8000`）。以上均以逐字稿 4.1–4.2 的**實際完整內容**為準，不得自行改寫成不可執行的簡化版。
- 實作指令順序及作用：`docker build -t demo-api:1.0 .` → `docker image ls demo-api` → `docker run -d --name api-a -p 8000:8000 demo-api:1.0` → 瀏覽 `http://localhost:8000/` → `docker run -d --name api-b -p 8001:8000 demo-api:1.0` → `docker ps` → 瀏覽 `http://localhost:8001/` → `docker rm -f api-a api-b`。實作時須解釋兩個 Container 使用同一份 Image，**未重複 Build／pip install**，並說明不同的 Host Port Mapping。
- **預期結果（尚非實測結論）**：Image Build 成功但不會直接啟動 API；兩個網址分別回傳 `{"message":"Hello Docker"}`；`docker ps` 顯示兩個 Running Container，IMAGE 均為 `demo-api:1.0`。示範需先確保 Docker CLI／Engine 可用、能拉取 Base Image，且 Host 8000／8001 未被佔用。
- **核准狀態與驗證狀態要分開**：逐字稿＋實作步驟已獲使用者核准並更新 GitHub；本次**尚未實際執行 Docker 指令**，也未完成整堂試講時長驗證；**HTML／Learning Map 未因這次 MD 更新而自動完成**。不准將預期輸出冒充已驗證結果。
- **深度邊界**：第一堂只講 Dockerfile 基本用途、Image 內容／靜態本質、`RUN`（Build 階段）與 `CMD`（Container 啟動階段）之別、Image→Container。Layer／OCI Manifest／Registry／Digest／BuildKit／Engine API 等較深入的架構留給後續適當單元；講者不需口頭預告固定章節。示範中的 `requirements.txt` 未釘選套件版本，跨時間重新 Build 的實際套件版本不保證完全一樣。
- **閱讀順序與指示優先級**：若本檔下方任何歷史敘述仍提「Dockerfile／Image／Container 或 build/run 尚未確認」「舊版 Section 06 是收尾」等，均以本決議及目前 `Docker/TEACHING_SCRIPT.md` 的四章十三節為準。

## 1. 變更背景與已確認的決策

舊版 Session 01 曾由 Program/Process 直接跳到 Container，缺少部署情境至 Container 的因果橋樑；新逐字稿已補齊部署取捨與隔離需求的因果脈絡。使用者已確認前兩段口頭講稿：① Program/Process → 執行環境與傳統部署；② 多服務部署時共用 VM 與分開 VM 的取捨，最後提出「服務要互不干擾，是否一定需要每個服務各自的 Guest OS？」。目前也已同意寫入第③段 What Is a Container：從隔離性（Isolation）承接 Bridge，解釋 Linux Kernel 可為 Process 提供隔離執行環境，結尾強調 Container 不是圖中的實體小盒子，本質上仍是一個或一組受隔離機制約束的 Linux Process。第三段已入稿，並於 2026-11-24 將結尾改為自然連接 VM／Container 比較。**新增第四段「VM vs Container：最核心的架構差異」**，只比較每台 VM 的 Guest OS／Kernel 與 Container 共用 Host Kernel、通常更輕量以及隔離邊界差異，不講隔離技術如何實作。第五段「What Is Docker 的開場 Bridge」也已獲確認：Container 解決隔離，但 Runtime / Dependencies / Configuration 的準備工作仍存在，進一步帶出方便、標準化的環境建構與重複使用需求，以及 Docker 的價值。**Dockerfile／Image／Container 的基礎教學與示範已確認；Registry／Digest／Layer 細節尚未納入**。目前另已確認**第一堂收尾**，重點包括 Program／Process 與 Image／Container 的有限類比、一份 Image 建立多個 Container、初步說明 Build Once, Deploy Many，以及以 Container 和 Docker 的職責分工作為完整的知識收束，不以固定後續堂次作為講課結尾。**該收尾與中間 Dockerfile／Image／Container 及實作均已獲核准入稿**。已確認的八個講述段落皆以 `Docker/TEACHING_SCRIPT.md` 為準。

**新確認的課程結構決策（2026-11-22）**：原有八堂取消獨立的 Session 02「Why Containerization?」，改為**七堂**；原 Session 03「How Containers Work」提前為新 Session 02，後續原 Session 04–08 依序前移一堂。第一堂已從傳統部署到隔離需求、再到 Docker 的動機說明基本的 Why，因此不再為 Environment Drift／Dependencies 重複安排一整堂。原 Session 02 有價值的跨環境交付概念保留但分流：第一堂介紹完 Dockerfile → Image → Container 與簡單 build/run 後，**簡短**說明同一份 Image 可用於多環境、Build Once, Deploy Many；Image Registry、Digest、細部交付差異／限制應放在後續 Image／Build 相關課程適當位置。這個**第一堂收尾現已獲確認並寫入逐字稿**；而中間 Dockerfile／Image／Container 的基本講述與示範也已獲准。

核心決策：

1. **Session 01 的順序調整為**：Program → Process → Execution Environment（Runtime / Dependencies / Configuration）→ 傳統部署情境 → 共用 VM／分開 VM 的取捨 → 是否一定需要獨立 Guest OS 的問題 → Isolation → What Is a Container?（先說本質為一個或一組 Process）→ **VM vs Container 最小架構對照（已確認，約 2–3 分鐘）** → What Is Docker? Bridge（隔離已做到，但環境仍需準備）→ Dockerfile / Image / Container（3.2–3.4 已確認）→ 簡單 build/run 示範（4.1–4.2 已確認、待實際驗證）→ **已確認的收尾**（Program／Process 類比 → 一份 Image 多個 Container → Build Once, Deploy Many → Container 與 Docker 的分工總結）→ 理解驗收。
2. 先讓學員知道傳統部署如何在 Linux Server／VM 上準備執行條件；再以**共用 VM 需管理多個服務的執行環境／一服務一 VM 需維護更多 Guest OS** 這項取捨推進。VM 是合理的實務方案，並非預設每個服務一定各有一台 VM。**在介紹 Container 之前，只用 Guest OS 數量與維護成本支撐提問；完成 Container 定義後，才加入 2–3 分鐘的基礎 VM／Container 對照。** 不要求學員理解 Hypervisor 實作，也不深入隔離架構。
3. Container 的引入必須承接**已核准的部署取捨 Bridge**：服務需求不同 → 共用 VM 的環境管理取捨 → 分開 VM 的 Guest OS 維護成本 → 提出「服務互不干擾，是否一定需要獨立 Guest OS？」的問題，並將 Kernel 首次介紹安排到 2.2 → 解釋真正重視的是隔離性（Isolation）→ Linux Kernel 可約束一個或一組 Process 的資源視圖／使用 → Container 定義。**不能先替學員預設「我們希望不要 Guest OS」或突然轉向 CPU／Memory／Network 隔離**；先讓取捨與成本有依據，再提出問題。結尾**才**用網路架構圖的方框破除「Container 是獨立小盒子」的錯覺，簡短強調本質上是一個或一組受到隔離機制約束的 Linux Process，避免堆疊「不是什麼、也不是什麼」的冗長尾段。**不要把「解決 Python Dependency 問題」描述成 Container 技術誕生的歷史原因**，也不要把「Image 封裝能力」誤當成 Container 的定義。
4. **先 Container，後 Docker**：前者是具有隔離邊界的執行環境；Docker 是協助建構 Image、建立與管理 Container 的工具／平台。不是所有 Container 都必須透過 Docker 建立。**已確認的 Docker 開場因果**：Linux 已能為多個服務建立 Container → 仍需準備 Runtime、Dependencies 與 Configuration → 和傳統 VM 部署一樣，環境準備及管理工作沒有自動消失 → 腳本與既有工具雖可自動化，仍有整合、標準化與重複使用的需求 → Docker 提供一致的 Image 建構與 Container 管理方式。**不得跳過這條因果鏈，直接用「要部署到另一台 Server」引出 Docker**。
5. **取消獨立 Why Containerization 堂次**：不再將 Environment Drift、Dependencies 相依衝突及 Containerization 優勢包裝成新 Session 02，避免與第一堂已完成的因果敘事重複。第一堂在 Image 基本概念之後，以**短篇幅**說明「Image 可重複交付／Build Once, Deploy Many」，不展開 Registry／Digest 或跨環境所有細節；後續 Image／Build 課再深入這些概念及限制（相同 Image 不等於所有 Runtime/Configuration/Kernel 環境相同）。
6. **How Containers Work 的預定範圍**：Linux Kernel、Namespaces、cgroups、Root Filesystem，以及 VM／Container 隔離邊界的深入原理。第一堂**已包含最小架構對照**（獨立 Guest Kernel vs 共享 Host Kernel），但不講 Hypervisor、Namespace、cgroups 的底層操作與實作細節。課綱仍可調整；口頭講稿不能以預告「第二堂／後續某章」代替自然收尾。
7. **七堂新順序（舊 → 新）**：原 01 → 新 01 What Is a Container & Docker?；原 02 Why Containerization? → **取消獨立章節並重新分配內容**；原 03 → 新 02 How Containers Work；原 04 → 新 03 Dockerfile & Image Layers；原 05 → 新 04 Docker Build Cache & Best Practices；原 06 → 新 05 Container Lifecycle & Storage；原 07 → 新 06 Docker Networking；原 08 → 新 07 From Docker to Kubernetes。
8. 課綱是基準，不是不可更改的鐵律。當教學連貫性與既有時間表衝突時，應調整章節段落或時間分配，**不要為了死守分鐘數而犧牲教學深度**。

## 2026-11-24 講稿銜接規則（優先適用）

- **講課文字必須自成因果**：每段以已回答的問題、已建立的技術結論或自然引出的下一個概念收束；不要靠「下一堂會講」、「後面的章節再深入」、「這就是第二堂的問題」、「先記住，之後再談」等排程預告收尾。課程順序可能調整，此規則優先於早期帶有特定堂次預告的指示。
- **本次實際修訂範圍**：逐字稿 01 收尾不再刻意宣布下一節、02 精簡重複的部署背景、03 直接回到 Isolation 並收束在 Process 本質、04 插入 VM／Container 對照、05 以 Dockerfile／Image／Container 自然承接、06 詳述 Dockerfile／Image／Container、07 完整實作、08 以 Container 與 Docker 分工完成整堂總結。
- **編排資訊與教學口語分離**：課程地圖、Agent 指示與講稿的編輯註記可以記錄後續主題，但不應混入學員實際聽到的口語稿。保留原本確認的技術論證與範例，不將『已核准的基本講解與示範』誤標為『已完成實機驗證／深入底層教學』。

## 2. 已確認內容的唯一來源

- `Docker/TEACHING_SCRIPT.md`：**Lesson 01 現已依四個 Chapter／十三個 Section 編排已確認的口頭稿**，仍完整保留 `app.py`／`requirements.txt`／`Dockerfile`、build/run 示範與收尾。最新編號與內容請以上方規格為準。
- **新核准範圍**：已允許在第一堂基本介紹 Image 的本質（檔案系統內容＋執行設定、靜態唯讀、無獨立 Kernel），並完整示範同一份 Image 建立兩個 Container。未核准替學員講授完整 Image Layers、OCI 與 BuildKit 的底層機制。口語收尾不得固定預告其他堂次。
- 後續由口頭討論產生的新稿，**只有使用者明確確認後**，才可追加至 `TEACHING_SCRIPT.md`，除非使用者明確要求修整原段落銜接、措辭或技術正確性；此類修訂須維持已確認的核心論證。
- 目前第一堂所需基本介紹與最小示範均已確認入稿。Registry／Digest／完整 Image Layers／BuildKit／Docker Engine 架構等深入內容仍待安排，不應以此入稿範圍推定它們已完成。

## 3. 對現有檔案的具體編修要求

### A. `Docker/lessons/0001-what-is-container-docker.html`（主要修改對象）

**Section 01（現行「FROM CODE TO PROCESS」）**

- 維持 Program vs Process 的基礎定義與一份程式可啟動多個 Process 的例子。
- 參照 `TEACHING_SCRIPT.md`，延伸具體情境：本機 FastAPI 可以運作 → 要部署到 Linux Server／既有或新建 VM → 準備 Python Runtime、套件 Dependencies、環境變數與設定 → 才能啟動服務。
- 強調：「Application Code 不等於完整的 Execution Environment」；這是對執行條件的認識，不是宣稱傳統部署一定失敗。
- 清楚說明：VM 可正常部署應用程式；工程師也能使用部署腳本或 Configuration Management 自動化，不要寫成「傳統部署每次都重建 VM」或「VM 做不到」。
- **新增已確認的 Bridge（須參照逐字稿完整保留推進順序）**：一支 API 在 VM 上正常部署 → 十個不同需求的服務 → 可以共用一台 VM，也可以分開部署到不同 VM → 共用方式要管理版本與環境相互影響，分開方式有更多 Guest OS 要更新、修補、配置與維護 → 兩種方案各有取捨 → 才問「為了各自的執行環境，是否每次都需要完整 Guest OS？服務互不干擾，是否一定要各自一套 Guest OS？」。不可把這段縮成突兀的資源隔離提問。
- 現有程式／示意圖可保留或調整，但須與新的講述順序一致；如果改圖，圖上要能區分 Code、Runtime、Dependencies、Configuration、Process。
- 原 Section 01 結尾只問「三份 app.py 是否對應三個 Process」過於單薄；保留該題作初階檢查，另可增加「程式碼相同是否保證兩台主機執行條件相同？」的情境推理題，答案由前文可推得，不要求後續技術知識。

**Section 02（現行「Container：讓程式在有邊界的環境裡執行」）**

- 從前段已確認的 **「共用 VM／分開 VM 的部署取捨 → 服務互不干擾是否必須各自使用 Guest OS」** 提問承接，按照已同意入稿的第三段，先點明本來想要的是服務間的 Isolation，再說明 Linux Kernel 可對一個或一組 Process 提供檔案系統視圖、網路與資源控制等隔離，最後定義 Container。段落**結尾**再說明架構圖上的方框不代表實體小盒子；容器中的執行活動本質上仍是 Linux Process。**直接結束在這個已解釋的技術事實，然後銜接 VM／Container 對照**，不要再加「後面的課程會詳細介紹」等編排性句子。
- 可以用兩個服務使用不同 Runtime 作為**現象／例子**，但不可把不同 Python 版本歸因於 Namespace/cgroups 本身；其檔案來源／Root Filesystem／Image 準備的機制留在後面。
- 此節不要求學員解釋 Namespace、cgroups、PID namespace、Network namespace、Filesystem 掛載的機制；如果圖示標出 Kernel，僅用於建立「不是另一套完整 OS」的基本概念，不深挖架構對照。
- 不要把 Container 簡化為「把程式與套件包起來」；封裝成可交付的 Image 是另一層概念。

**新增小節：VM vs Container（逐字稿 Section 04）**

- 插入位置：緊接 What Is a Container 的「一個或一組受到隔離的 Linux Process」結論之後、What Is Docker 的 Bridge 之前。**不可放在尚未定義 Container 的傳統部署 Bridge 裡**。
- 時長約 2–3 分鐘。對照「VM：Hypervisor 提供虛擬化硬體，每台 VM 可有各自 Guest OS／Kernel」與「Container：Process 共享 Host Linux Kernel，但有隔離的執行環境」；簡述通常更輕量、啟動較快，以及隔離邊界不同。不得聲稱 Container 隔離等同 VM，也不得把比較擴張成底層課程。
- 以「Container 不是縮小版 VM，而是另一種隔離執行環境」自然收束，再切換到尚待解決的 Runtime／Dependencies 準備工作。**不以「下堂再講 Hypervisor／Namespace」結尾**。

**Section 03（Docker／Dockerfile／Image／Container；此處為既有 HTML 區段名稱，非逐字稿編號）**

- 維持先 Container、再 Docker 的順序；明確說明 Docker 並非 Container 的同義詞或唯一實作。
- **已確認的 Docker 開場 Bridge（逐字稿 3.1）**：延續同一台 Linux Server 上多個服務的部署故事。先提醒 Container 讓服務隔離、共用 Linux Kernel，不代表 Python Runtime、Dependencies、Configuration、啟動設定會自動出現；再比較以前在 VM 上部署時仍須準備執行條件，說明環境準備／管理是尚未消失的問題。承認 Shell Script、LXC Templates 等現有方法可自動化，避免宣稱沒有 Docker 就必須手動重裝。最後再提出「如何方便、標準化地描述、建構和重複使用環境」，帶出 Docker 的 Image 建構及 Container 管理價值。此處**禁止突然改談部署到其他 Server**，跨主機交付應放在 Image / Registry 後續章節中。
- Agent 應保留上述**已確認的橋樑敘事**，並緊接已確認的 3.2–3.4 Dockerfile／Image／Container 講稿；不得把 Registry／OCI 等深入內容擅自提前到此。
- 概念分工清楚：Dockerfile＝Image 的建構指示；Image＝包含檔案及設定的可重複使用建構產物；Container＝根據 Image 建立的實例（可處於 running 或 stopped）；Docker Engine＝管理相關資源的系統。
- 可把 1.1–1.3 的部署情境接回來，讓學員理解 Dockerfile、Image 如何協助準備及重複使用已建構的內容。**第一堂收尾已確認短講 Build Once, Deploy Many**：Image 不只用於建立多個 Container，也可作為多環境的相同建構產物；只講意義、前提和基本限制，不完整展開 Environment Drift／Registry／Digest／交付工程細節。這些完整內容移至後續 Image／Build 課；正式教材需依逐字稿已確認的 4.3 收尾編排。
- 一份 Image 可以建立多個 Container，應透過簡單示範驗證；保留 Image ≠ 正在執行的 Process 等重要區別。

**第一堂已確認收尾（逐字稿 4.3；接續 3.2–3.4／4.1–4.2 之後）**

- 保留使用者特別確認的因果：**同一份 Program 能啟動多個 Process → Container 裡面執行的本質仍是 Linux Process → 同一份 Image 可以建立多個 Container**。這是理解多個執行實例的類比；不能畫上完全等號，因為 Image 含檔案系統內容／執行設定，Container 具生命週期、Writable Layer，且一個 Container 可包含一個或多個 Process。
- 明確區分 Image（不在執行的建構產物）、Container（依 Image 建立的執行實例）、Process（Linux Kernel 排程的執行單位），不能說「一份 Image 直接同時啟動多個 Process 而不經 Container」；示範多個 Container 彼此隔離，仍共享基礎 Image。
- 在同一 Image 多個 Container 的概念後，**簡短**延伸相同 Image 可跨 Development／Stage／Production 使用，點到 Build Once, Deploy Many；說明這無法保證外部環境、Configuration、Kernel 全部相同，Registry／Digest 深入細節留後續。
- **收尾方式**：以「共用 Linux Kernel 的 Process 能擁有不同檔案系統視圖／網路／資源限制，是 Linux 隔離與資源控制能力的結果」作最小解釋，最後總結 **Container 建立隔離邊界、Docker 協助標準化建構與管理**。不得以「這就是第二堂要回答的問題」或其他課程預告作為結尾。
- **順序與核准狀態**：Docker Bridge 位於 3.1，Dockerfile／Image／Container 位於 3.2–3.4，實作位於 4.1–4.2，收尾位於 4.3；均已核准入稿，但仍須實機驗證與編修 HTML。

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
2. 先依**四 Chapter／十三 Section** 校對 Lesson 01：1.1–1.3、2.1–2.3、3.1–3.4、4.1–4.3。保留 3.2–3.4 基本教學、4.1–4.2 完整實作，4.3 才進入收尾；將已核准講稿、已實測指令、已更新 HTML、已上傳圖資分開驗收。
3. 對照第一堂新增的**部署取捨橋樑**與七堂新結構，確認沒有獨立 Why 專章；How Containers Work 仍規劃深入 Linux 隔離與 VM／Container 架構（第一堂已新增最小比較）；新第三堂起再深入 Dockerfile／Image Layers／交付相關技術。同步規劃 Course Map、Notes、Mission 與所有導覽連結的更新；保持從已知部署情境到新概念的因果順序。
4. 檢查技術正確性、互動功能、連結、手機版排版、CSS 與可讀性；若實際變更 HTML，才在測試與驗證後更新對外教材的完成狀態。
5. **本檔案改為七堂課調整規格，不代表已經修改或發佈 HTML，也不代表 Session 01 已正式理解驗收。** 既有網站目前仍可能記載舊八堂「已撰寫 Session 01–02／正式驗收 0/8」，那是**尚待遷移的舊版狀態**，不得把舊 HTML 的完成數直接算成新七堂已完成／已驗收；正式變更後需重算並提供真實狀態。

## 6. 後續維護方式

- 已獲使用者確認的**講課逐字稿**：追加到 `Docker/TEACHING_SCRIPT.md`。
- 因討論而確認的**教材結構／內容變更**：同步更新本檔案，註明影響章節、修正原因與具體驗收準則。2026-11-22 已確認傳統部署 Bridge、What Is a Container、Docker Bridge、第一堂收尾；**2026-11-24 加入 VM vs Container 比較、修整自然銜接，並核准 Dockerfile／Image／Container 基本講稿與 build/run 示範**，並確定八堂改七堂、取消 Why Containerization 獨立堂次；不得只更新逐字稿而讓 Agent 指示沿用舊編排、錯誤過渡或跳到跨主機部署，也不可忽略第三段結尾需精簡的回饋。
- 未經確認的教學建議，應明確標示「提案／待確認」，不可寫成既定決策。
- 當使用者明確要求更新現有 GitHub Pages 教材時，再依本檔案實作 HTML/課程地圖/必要參考頁，並核對實際 commit/頁面狀態。
