# Docker Fundamentals — 口頭教學逐字稿

> **用途：**記錄討論後、已經確認可用於實際分享的口頭教學講稿。每次確認新段落後，持續更新本檔案；尚未確認的內容不預先寫入。
>
> **對象：**具備基本程式開發經驗的工程師。
>
> **目前進度：**Session 01 — 已確認開場（Program / Process → 傳統部署與 Execution Environment）；尚未進入 What Is a Container。
>
> **確認日期：**2026-11-22

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

<!-- 後續僅於口頭教學段落獲得確認後，在此新增內容。 -->
