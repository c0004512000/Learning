# Docker Fundamentals — 口頭教學逐字稿

> **用途：**記錄討論後、已經確認可用於實際分享的口頭教學講稿。每次確認新段落後，持續更新本檔案；尚未確認的內容不預先寫入。
>
> **對象：**具備基本程式開發經驗的工程師。
>
> **目前進度：**Session 01 — 已確認開場、部署取捨 Bridge、What Is a Container、**VM vs Container 基本比較**、What Is Docker 開場 Bridge，以及第一堂收尾。Dockerfile／Image／Container 的正式詳細講述與 build/run 示範仍待確認。
>
> **課程結構決議（2026-11-22）：**取消獨立的 Why Containerization，原八堂調整為七堂。Session 01 整合必要的 Why；Session 02 改為 How Containers Work。此決議不代表後續尚未確認的口頭講稿已完成。
>
> **最近修訂：**2026-11-24（新增 VM／Container 比較，通盤調整段落銜接；講述不依賴固定堂次）

---

## 課程結構備註（已確認；非口頭逐字稿）

- **新 Session 01 — What Is a Container & Docker?**：保留目前已確認的開場、兩段 Bridge、What Is a Container、VM vs Container 基本比較，以及**已確認的第一堂收尾**（下方 Section 06）。課程正式編排時，必須先補足尚待確認的 Dockerfile → Image → Container 基本講解與簡單 build/run 示範，**再接到已確認的收尾**。收尾包含 Program／Process 類比、一份 Image 建立多個 Container、同一份 Image 可跨環境使用及 Build Once, Deploy Many 的初步意義。**不可把收尾獲准視為中間講述或實作也獲准**；Registry／Image Digest 的深入細節留待後續 Image 課程。
- **課程規劃中的 How Containers Work**：深入 Linux Kernel、Namespaces、cgroups、Root Filesystem，以及 VM 與 Linux Container 的隔離機制。此處僅記錄規劃；講稿不得以「下一堂／後面某章會講」作為收尾。
- **後續堂次依序前移**：原 Session 04 → 新 03（Dockerfile & Image Layers）；原 05 → 新 04（Docker Build Cache & Best Practices）；原 06 → 新 05（Container Lifecycle & Storage）；原 07 → 新 06（Docker Networking）；原 08 → 新 07（From Docker to Kubernetes）。
- 原獨立 Session 02「Why Containerization?」**取消作為獨立章節**；其 Environment Drift、跨環境部署一致性、Build Once 等有價值概念，整合進第一堂簡述與後續 Image／Build 教學，不再重複上一堂的隔離與依賴問題。
- **文件同步範圍**：本次依確認的方向加入 VM／Container 比較，並只修整既有講述的過渡與收尾，不改變核心論證。教材實作與公開頁面是否同步，另以實際 GitHub 狀態核對；編修指示詳見 `Docker/LESSON_ADJUSTMENTS.md`。

---

## Session 01 — What Is a Container & Docker?

### 01. 開場：從 Program、Process 到部署情境

**狀態：已確認**

今天我們要開始 Docker Fundamentals，但在講 Docker 跟 Container 之前，我想先從大家每天都在做的事情開始：執行程式。

假設你寫了一支 Python API，檔名叫 `app.py`，放在電腦硬碟裡面，這時候它其實還沒有在跑，它只是靜靜躺在那裡的程式內容，我們叫它 Program。

那什麼時候它才真的動起來呢？

假設你打開 Terminal，輸入 `python app.py`，這時候作業系統會啟動 Python Interpreter，載入並執行這份程式碼，於是一個正在執行的實例出現了，這個叫做 Process。

同一個 Program 可以同時跑很多個 Process，每一個都有自己的 PID 跟記憶體空間。記住這個差別：Program 是程式內容，Process 是它正在執行的實例。

好，接下來把情境拉回大家熟悉的工作：你在自己電腦上把一支 FastAPI 寫好，跑起來沒問題，現在公司要你把它放到一台 Linux Server，你會怎麼做？

傳統作法可能是在一台 VM 上準備好正確版本的 Python、安裝需要的套件、設定環境變數，最後把程式啟動。

這樣當然可以，也可以用自動化工具幫忙，但重點是：一支程式能不能跑，不只取決於程式碼，還取決於 Runtime、Dependencies、Configuration，還有系統提供的各種條件。

如果同一台主機上要放多個服務，而且版本跟需求不同，我們還得思考怎麼管理它們各自的執行環境，以及怎麼避免彼此影響。

所以，服務能不能跑是一回事；當服務變多，該怎麼安排它們各自的執行環境，又是另一個需要考慮的問題。

---

### 02. Bridge：從傳統部署的取捨提出問題

**狀態：已確認（本節為進入 What Is a Container 前的橋樑）**

假設公司今天不只有一支 API，而是有十個服務，而且每個服務需要的版本都不一樣。這些服務要怎麼部署？

我們可以把它們全部放在同一台 VM，也可以選擇一個服務使用一台 VM。

如果放在一起，我們就得小心管理不同服務的環境，避免套件、設定或維護作業互相影響。

如果分開放，不同服務之間就可以有更明確的隔離。但我們也從原本管理一台 VM，變成可能要管理十台 VM、十套 Guest OS。

每套 Guest OS 都需要更新、安全修補、資源配置和維護。當服務數量越來越多，這些管理成本和工作量也可能跟著增加。

所以你會發現，不管選哪一種做法，都有取捨。

把服務放在一起，可以減少需要管理的作業系統數量，但要處理環境互相干擾的問題；把服務分開，可以取得更明確的隔離，卻可能需要維護更多套 Guest OS。

到這裡，我們就可以進一步思考：

**為了讓每個服務擁有自己的執行環境，我們真的每次都需要準備一整套 Guest OS 嗎？**

**還是作業系統本身就有辦法，讓不同的 Process 擁有相對獨立的執行環境，而不需要為每一組 Process 都啟動一套新的 Kernel？**


---

### 03. What Is a Container? — 隔離性與 Process 的本質

**狀態：已同意納入逐字稿，結尾措辭仍可再微調**

要回答剛才那個問題，我們先想清楚：為什麼會考慮把服務分到不同 VM？

其實不是因為每個服務都特別需要一整套作業系統，而是希望它們有各自的執行環境，不會因為其他服務修改設定或更新套件，就直接受到影響。

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

---

### 04. VM vs Container：最核心的架構差異

**狀態：已確認納入（2026-11-24；基礎對照，不深入 Hypervisor／Namespace／cgroups 實作）**

這裡可以順著剛才的情境，回頭比較一下 VM 跟 Container 到底差在哪裡。

前面說過，如果服務分別部署到不同 VM，就可能需要維護多套 Guest OS。為什麼換成 Container，就不需要為每個服務再準備一套？

先看 VM。一般的 VM 是透過 Hypervisor 提供虛擬化的硬體環境，讓每台 VM 都能執行自己的 Guest OS，包括自己的 Kernel。兩個服務如果分別執行在兩台 Linux VM 裡，背後就有兩套獨立的 Linux Kernel。

Container 則不同。在同一台 Linux 主機上，即使兩個 Container 能看到不同的檔案系統、使用各自的網路環境，裡面執行的仍然是 Host Kernel 管理的 Process。**它們共用同一個 Linux Kernel，而不是各自啟動一套新的 Guest OS。**

這就是兩者最核心的架構差異：**VM 透過各自的 Guest OS 與 Kernel 建立執行環境；Container 則是在共用 Kernel 的前提下，為 Process 建立隔離邊界。**

也因為不必為每個 Container 額外啟動 Guest OS，Container 通常更輕量，啟動也通常比較快。不過，兩者的隔離邊界不同；VM 通常能提供更強的隔離，但實際安全性仍取決於設定與使用情境。

所以 Container 並不是縮小版的 VM，而是另一種讓不同服務擁有隔離執行環境的方式。

---

### 05. Bridge：從 Container 的隔離能力帶出 Docker

**狀態：已確認（What Is Docker 的開場橋樑；Dockerfile / Image / Registry 細節尚未確認）**

從剛才的比較可以發現，Container 讓我們不一定需要為每個服務都準備獨立的 VM，也能建立隔離的執行環境。

但有了隔離，應用程式就能直接執行了嗎？

回到我們一開始部署 Python API 的情境。

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

而最直接能看出 Docker 如何做到這件事的，就是 Dockerfile、Image 和 Container 之間的關係。

> **教學範圍：**本段已確認的是從 Container 過渡到 Docker 的因果橋樑。先延續**同一台 Linux Server** 上多個服務的情境，說明隔離已可做到但 Runtime / Dependencies / Configuration 仍需準備。**不要在此處突然跳到其他 Server 的交付與部署**；跨主機分享、Image / Registry 的詳細解釋，留待後續逐段確認。

---

### 06. 第一堂收尾：從 Program／Process 到 Image／Container

**狀態：已確認（2026-11-22；應放在尚待確認的 Dockerfile／Image／Container 講述與實作示範之後）**

最後，我們把剛才一路建立的幾個觀念串起來。

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

當然，使用同一份 Image，不代表不同環境的所有執行條件都完全相同。環境變數、外部服務，以及 Host 的系統條件，都還可能造成差異。Image 能讓建構成果重複使用，但不會自動讓所有部署條件變得一致。

所以現在我們可以把三者的關係整理清楚：

**Dockerfile 描述如何建構，Image 保存建構成果，Container 則是根據 Image 建立的執行實例。**

到這裡，我們不只是知道 `docker build`、`docker run` 這些指令的名稱，而是能理解一支應用程式如何從程式碼和執行條件，變成真正運作的 Container。

最後再回到 Container 的本質：裡面執行的依然是 Linux Process，而且它們共用 Host 的 Linux Kernel。不同 Container 卻能擁有各自的檔案系統視圖、網路環境與資源限制，靠的正是 Linux 提供的隔離與資源控制能力。

**所以，Container 讓 Process 在共用 Kernel 的前提下擁有隔離邊界；Docker 則讓這些執行環境更容易被建構、重複使用與管理。**

這就是從 Program、Process 一路理解到 Container 與 Docker，最重要的整體觀念。

> **編排註記（非講課內容）：**本段收尾已獲確認；Section 05 與本段之間的 Dockerfile／Image／Container 正式教學與 build/run 示範尚未定稿。正式教材必須補齊中間內容才能接上收尾。講課文字以本節知識結論結束，不預告固定堂次或章節順序。

---

<!-- 後續僅於口頭教學段落獲得確認後，在此新增內容。 -->
