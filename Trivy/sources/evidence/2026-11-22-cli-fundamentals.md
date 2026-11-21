# Phase 02：Trivy CLI 基礎教學查核（2026-11-22）

## 引入原因

既有 Phase 02 Lesson 03 直接從最小 PoC 指令開始，缺少 CLI 本身的執行位置、目標型態與資料來源、掃描項目、漏洞資料庫及輸出模型。

新增「Phase 02 前導 Lesson」，在 Lesson 03 之前建立操作概念。此為學習過程出現的必要前置橋接，不改動 14 堂原訂主線 Lesson 進度。

## 官方文件

- [Trivy Filesystem](https://trivy.dev/docs/latest/guide/target/filesystem/)：`trivy fs <path>` 讀取本機檔案／目錄；多種 Scanner 可配置，漏洞 Scanner 常從受支援套件清單取得資料。
- [Trivy Code Repository](https://trivy.dev/docs/latest/guide/target/repository/)：`trivy repo <local-path|URL>`，可指定 Git branch、commit、tag；與 Image scan 目標不同。
- [Trivy Container Image](https://trivy.dev/docs/latest/guide/target/container_image/)：支援 local Docker Engine、containerd、Podman、Container Registry 等 Image 來源，`--image-src` 可限制來源。
- [Trivy Vulnerability Scanner](https://trivy.dev/docs/latest/guide/scanner/vulnerability/)：辨識已知軟體漏洞；依 OS 套件／應用套件及資料來源不同而異，不是執行軟體並利用漏洞的動態測試。
- [Trivy Databases](https://trivy.dev/docs/latest/guide/configuration/db/)：CLI 程式與 DB 分離；Trivy 依需要取得 Vulnerability DB、Java DB、Checks Bundle 等，預設及管理方式以官方文件為準。
- [Trivy Standalone Mode](https://trivy.dev/docs/latest/guide/references/modes/standalone/)：基礎操作不需要常駐服務。

## 證據界線

本文是基於官方文件的原理教學與情境推導，尚未在使用者公司的 ARC Runner 實測 Registry/CA/Proxy、Docker API、Windows 執行環境、掃描報告或 UI 瀏覽器動作。

「Trivy CLI 可以從 Registry 讀取 Image」不等於特定 Harbor 帳號、網路與憑證條件已經滿足；「已辨識套件」不等於漏洞覆蓋率達到 100%。
