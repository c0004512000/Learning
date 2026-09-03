# Glossary — Linux Namespace

只收錄已在目前教材正式建立的名詞。後續 lesson 建立新概念後再逐步擴充。

## Program

儲存在檔案系統中的程式內容，例如 `/usr/bin/bash`。它本身是靜態資料；被執行後才會形成 process。

## Process

正在執行中的 program instance。Process 具有自己的執行狀態，並透過 Linux kernel 使用或查詢 kernel 管理的資源。

## PID

Process ID。Linux 用來識別 process 的數字；同一個 process 在不同 PID namespace 視角下可能看到不同 PID。PID namespace 的細節尚未進入正式課程。

## Linux kernel

作業系統核心。它管理 process、memory、filesystem、networking、devices 等底層資源，並提供 user-space program 存取這些能力的介面。

## User space

一般 application / process 執行的空間。User-space process 不能任意直接操作 kernel 內部資料，而是透過 kernel 提供的介面要求服務。

## Namespace

Linux kernel 對某一類原本屬於系統全域的資源建立隔離視圖的機制。不同 namespace 中的 process 可以使用同一顆 kernel，卻對該類資源看到不同的 instance / view。

## Namespace membership

某個 process 屬於哪一個 namespace object。Process 對每種 namespace type 都有相對應的 membership；kernel 依此決定該 process 對那一類資源看到的視圖。

## `/proc`

Linux 提供的 pseudo-filesystem，用檔案形式暴露 kernel 與 process 的資訊。`/proc/<pid>/ns/` 可以觀察指定 process 的 namespace membership。

## `/proc/<pid>/ns`

每個 process 的 namespace 入口目錄。裡面的 symbolic links 代表該 process 所屬的各種 namespace；兩個 process 對同一 namespace type 顯示相同 identifier，表示它們指向同一個 namespace object。
