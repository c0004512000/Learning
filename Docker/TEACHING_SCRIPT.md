# Docker Fundamentals — 口頭教學逐字稿

> **用途：**記錄討論後、已經確認可用於實際分享的口頭教學講稿。每次確認新段落後，持續更新本檔案；尚未確認的內容不預先寫入。
>
> **對象：**具備基本程式開發經驗的工程師。
>
> **目前進度：**Session 01 — 已確認開場、部署取捨 Bridge、What Is a Container（結尾可微調）、What Is Docker 的開場 Bridge，**以及第一堂收尾**。中間的 Dockerfile／Image／Container 詳細講述、build/run 示範仍待確認；Registry／Image Digest 的深入內容留在後續課程。
>
> **課程結構決議（2026-11-22）：**取消獨立的 Why Containerization，原八堂調整為七堂。Session 01 整合必要的 Why；Session 02 改為 How Containers Work。此決議不代表後續尚未確認的口頭講稿已完成。
>
> **確認日期：**2026-11-22

---

## 課程結構備註（已確認；非口頭逐字稿）

- **新 Session 01 — What Is a Container & Docker?**：保留目前已確認的開場、兩段 Bridge、What Is a Container，以及**已確認的第一堂收尾**（下方 Section 05）。課程正式編排時，必須先補足尚待確認的 Dockerfile → Image → Container 基本講解與簡單 build/run 示範，**再接到已確認的收尾**。收尾包含 Program／Process 類比、一份 Image 建立多個 Container、同一份 Image 可跨環境使用及 Build Once, Deploy Many 的初步意義。**不可把收尾獲准視為中間講述或實作也獲准**；Registry／Image Digest 的深入細節留待後續 Image 課程。
- **新 Session 02 — How Containers Work**：解釋 Linux Kernel、Namespaces、cgroups、Root Filesystem；正式比較 VM／Guest OS 與 Linux Container／共享 Kernel 的執行架構與隔離界線。
- **後續堂次依序前移**：原 Session 04 → 新 03（Dockerfile & Image Layers）；原 05 → 新 04（Docker Build Cache & Best Practices）；原 06 → 新 05（Container Lifecycle & Storage）；原 07 → 新 06（Docker Networking）；原 08 → 新 07（From Docker to Kubernetes）。
- 原獨立 Session 02「Why Containerization?」**取消作為獨立章節**；其 Environment Drift、跨環境部署一致性、Build Once 等有價值概念，整合進第一堂簡述與後續 Image／Build 教學，不再重複上一堂的隔離與依賴問題。
- **文件同步範圍**：此檔保留已確認講課段落不變；對教材實作、舊版 HTML 頁面、連結、正式課程地圖與章次更新的工作指示，詳見 `Docker/LESSON_ADJUSTMENTS.md`。目前尚未套用新七堂架構到現有 HTML。

---

## Session 01 — What Is a Container & Docker?

### 01. 開場：從 Program、Process 到部署情境

**狀態：已確認**

今天我們要開始 Docker Fundamentals，但在講 Docker 跟 Container 之前，我想先從大家每天都在做的事情開始：執行程式。

假設你寫了一支 Python API，檔名叫 `app.py`，放在電腦硬碟裡面，這時候它其實還沒有在跑，它只是靜靜躺在那裡的程式內容，我們叫它 Program。

那什麼時候它才真的動起來呢？

假設你打開 Terminal，輸入 `python app.py`，這時候作業系統會啟動 Python Interpreter，載入並執行這份程式碼，於是一個正在執行的實例出現了，這個叫做 Process。

同一個 Program 可以同時跑很多個 Process，每一個都有自己的 PID 跟記憶體空間。這裡我們先停一下，記住 Program 是內容，Process 是正在跑的實例。

好，接下來把情境拉回大家熟悉的工作：你在自己電腦上把一支 FastAPI 寫好，跑起來沒問題，現在公司要你把它放到一台 Linux Server，你會怎麼做？

傳統作法可能是在一台 VM 上準備好正確版本的 Python、安裝需要的套件、設定環境變數，最後把程式啟動。

這樣當然可以，也可以用自動化工具幫忙，但重點是：一支程式能不能跑，不只取決於程式碼，還取決於 Runtime、Dependencies、Configuration，還有系統提供的各種條件。

如果同一台主機上要放多個服務，而且版本跟需求不同，我們還得思考怎麼管理它們各自的執行環境，以及怎麼避免彼此影響。

先停在這裡，這就是我們等一下要正式認識 Container 的切入點。

---

### 02. Bridge：從傳統部署的取捨提出問題

**狀態：已確認（本節為進入 What Is a Container 前的橋樑）**

我們剛剛講了傳統部署：把一支 API 放到一台 VM，裝好 Runtime、Dependencies，就能讓它執行。

只有一個服務的時候，事情相對單純。但假設公司今天有十個服務，而且每個服務需要的版本都不一樣，這些服務要怎麼部署？

我們可以把它們全部放在同一台 VM，也可以選擇一個服務使用一台 VM。

如果放在一起，我們就得小心管理不同服務的環境，避免套件、設定或維護作業互相影響。

如果分開放，不同服務之間就可以有更明確的隔離。但我們也從原本管理一台 VM，變成可能要管理十台 VM、十套 Guest OS。

每套 Guest OS 都需要更新、安全修補、資源配置和維護。當服務數量越來越多，這些管理成本和工作量也可能跟著增加。

所以你會發現，不管選哪一種做法，都有取捨。

把服務放在一起，可以減少需要管理的作業系統數量，但要處理環境互相干擾的問題；把服務分開，可以取得更明確的隔離，卻可能需要維護更多套 Guest OS。

到這裡，我們就可以進一步思考：

**為了讓每個服務擁有自己的執行環境，我們真的每次都需要準備一整套 Guest OS 嗎？**

**還是作業系統本身就有辦法，讓不同的 Process 擁有相對獨立的執行環境，而不需要為每一組 Process 都啟動一套新的 Kernel？**

> **教學銜接：**此段停在提問，下一段由隔離性（Isolation）承接，才正式定義 Container。

---

### 03. What Is a Container? — 隔離性與 Process 的本質

**狀態：已同意納入逐字稿，結尾措辭仍可再微調**

好，我們剛才提到，多個服務放在同一台 VM，要處理不同服務之間的環境衝突；如果每個服務各自使用一台 VM，雖然能獲得更明確的隔離，卻也得維護更多套 Guest OS。

所以我們才問：**為了讓服務彼此隔離，一定需要各自獨立的作業系統嗎？**

我們仔細想一下，前面為什麼會考慮一個服務一台 VM？

其實不是因為我們特別需要那麼多套作業系統，而是希望每個服務能在自己的環境中運作，不會因為其他服務修改了系統設定、更新了某些套件，就直接受到影響。

換句話說，我們真正關心的，是服務之間的**隔離性，Isolation**。

VM 是實現隔離的一種方式，但不是唯一的方式。

還記得一開始介紹的 Process 嗎？

在 Linux 裡，Kernel 提供了一些機制，可以控制不同 Process 能夠看到、存取和使用哪些系統資源。

例如，可以讓某一群 Process 看到特定的檔案系統環境，使用自己的網路環境，或限制它們能夠使用的運算資源。

重點是，我們不需要為了實現這些隔離，就額外啟動一整套 Guest OS。

這些 Process 依然共用同一個 Linux Kernel，只是各自運作在具有特定隔離邊界的環境當中。

而透過這些 Linux 機制所建立的隔離執行環境，就是我們今天要認識的 **Container，也就是容器**。

那講到這裡，我想特別強調一件事。

我們在網路上的架構圖，常常看到一個方框寫著 Container，裡面放 Application、Libraries。這很容易讓人以為 Container 是一個小盒子，程式被裝進去之後才開始執行。

**但從 Linux 的角度來看，Container 本質上仍然是一個或一組受到隔離機制約束的 Process。**

它們不是另一套獨立的作業系統，仍然由 Host 的 Linux Kernel 負責執行。

這個觀念先記住就好。至於隔離背後如何實現，我們會在後面的章節再深入介紹。

> **後續微調註記：**使用者已同意先寫入本段，並指出結尾「但不是……」之後不宜堆疊太多否定或比喻，後續可繼續精簡措辭。技術表述需維持「一個或一組 Process」，不得誤導為每個 Container 必定只有一個 Process。

---

### 04. Bridge：從 Container 的隔離能力帶出 Docker

**狀態：已確認（What Is Docker 的開場橋樑；Dockerfile / Image / Registry 細節尚未確認）**

我們剛剛知道，Linux 其實已經具備建立 Container 的能力。

也就是說，即使只有一套 Linux Kernel，我們還是可以讓不同服務在具有隔離邊界的執行環境中運作。

這的確改善了我們前面提到的問題：不一定需要為每個服務都準備一台獨立的 VM。

但大家還記得我們一開始部署 Python API 的情境嗎？

即使現在可以建立 Container，**我們的應用程式依然需要 Python Runtime、Dependencies，以及必要的設定，才能正常執行。**

換句話說，Container 幫我們建立了隔離的執行環境，但不代表這個環境裡面就自動具備了應用程式需要的所有東西。

所以工程師依然得準備這些內容。

假設今天有十個服務，我們可能需要替它們準備不同版本的 Runtime、安裝各自需要的 Dependencies，再設定程式的啟動方式。

你會發現，這其實跟我們前面在 VM 上部署應用程式的情境，有一個很相似的地方。

雖然我們現在不一定需要替每個服務建立獨立的 Guest OS，**但應用程式執行環境的準備與管理工作，依然存在。**

當然，這些工作可以透過腳本和既有工具來自動化。

但如果今天我們希望同一份已經準備好的執行環境，可以很容易地重複使用，甚至能建立多個相同的執行實例呢？

那麼，我們就不只需要 Container 的隔離能力。

我們還需要一套方便、標準化的方式，來描述、建構及管理這些執行環境。

**而這正是 Docker 帶來的重要價值。**

Docker 並沒有重新發明 Container 的隔離機制，而是整合既有的容器技術，並提供 Image 建構、Container 管理等工具，讓工程師能更方便地準備與重複使用應用程式的執行環境。

接下來，我們就來看看 Docker 究竟透過哪些機制，實現這件事情。

> **教學範圍：**本段已確認的是從 Container 過渡到 Docker 的因果橋樑。先延續**同一台 Linux Server** 上多個服務的情境，說明隔離已可做到但 Runtime / Dependencies / Configuration 仍需準備。**不要在此處突然跳到其他 Server 的交付與部署**；跨主機分享、Image / Registry 的詳細解釋，留待後續逐段確認。

---

### 05. 第一堂收尾：一份 Image、多個 Container，以及第二堂的提問

**狀態：已確認（2026-11-22；應放在尚待確認的 Dockerfile／Image／Container 講述與實作示範之後）**

好，那我們最後把第一堂課的觀念串起來。

我們一開始從 Program 和 Process 出發，知道同一份 Program 可以被執行很多次，產生不同的 Process。

現在回頭想想，我們剛剛也說過，**Container 本質上仍然是一個或一組受到隔離機制約束的 Linux Process**。

所以這裡其實可以用一個很相似的方式來理解。

就像同一份 Program 可以啟動多個 Process 一樣，**同一份 Docker Image，也可以拿來建立並啟動多個 Container**。

例如，剛剛那支 Python API，我們只需要先建構好一份 Image，就可以根據同一份 Image 建立 Container A、Container B，讓它們各自執行。

不需要為了每建立一個 Container，就重新執行一次安裝 Python 和 Dependencies 的建構步驟。

不過，這個類比是為了理解「一份內容可以建立多個執行實例」，不是說 Image 完全等於 Program，或 Container 完全等於單一 Process。

Image 還包含建構好的檔案系統內容與執行設定；Container 也有自己的生命週期和可寫入層，而且一個 Container 裡面可以有不只一個 Process。

那麼，同一份 Image 除了能在同一台主機建立多個 Container，也可以交付到不同的部署環境使用。

例如 Development、Stage、Production，可以使用同一份經過建構與測試的 Image，而不需要每個環境再重新組裝一遍相同的 Runtime 和 Dependencies。

這就是 **Build Once, Deploy Many** 想表達的核心概念。

當然，使用同一份 Image，不代表不同環境的所有執行條件都完全相同。環境變數、外部服務，以及 Host 的系統條件，都還可能造成差異。至於 Image 的 Layer、Registry 和更深入的交付方式，後面會再談。

所以現在我們可以把三者的關係整理清楚：

**Dockerfile 描述如何建構，Image 保存建構成果，Container 則是根據 Image 建立的執行實例。**

到這裡，我們不只是知道 `docker build`、`docker run` 這些指令的名稱，而是能理解一支應用程式如何從程式碼和執行條件，變成真正運作的 Container。

不過，第一堂其實還留下一個很重要的問題。

我們知道 Container 裡面執行的依然是 Linux Process，而且它們共用同一個 Linux Kernel。

**那為什麼這些 Process，卻能看到不同的檔案系統、不同的網路環境，甚至受到不同的資源限制？**

Linux Kernel 究竟是怎麼做到這件事情的？

這就是第二堂 **How Containers Work** 要深入回答的問題。

> **編排註記（非講課內容）：**本段收尾已獲確認，但 Section 04 到本段之間的 Dockerfile／Image／Container 正式教學與 build/run 示範尚未定稿。正式教材須補齊中間段落，再使用此收尾，不可直接從 Docker 的開場 Bridge 跳到「剛剛已經 build/run」的回顧。

---

<!-- 後續僅於口頭教學段落獲得確認後，在此新增內容。 -->
