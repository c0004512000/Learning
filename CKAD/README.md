# CKAD Learning

[學習網站](https://c0004512000.github.io/Learning/CKAD/)

使用 c0004512000/Skills 的 Learning/Learning/SKILL.md；非 Learning-from-docs。
目前提供第一堂完整短課、互動標籤選取練習、回答摘要、速查與能力導向 Learning Map。
半年／每週 5 小時為時間預算；後續課程依理解逐步規劃。舊 24 週頁面保留在 weekly-plan.html，包含既有進度匯出。

## Implementation
純靜態 HTML/CSS/JS，沿用根目錄 Pages workflow。learning.css 源自 Learning skill 的 canonical presentation CSS；lesson.css 為可重用互動與手機呈現補充；learning-theme.js 加入 dark-first 和儲存失敗容錯。
第一堂僅在瀏覽器計算標籤條件；不連接叢集。練習摘要由使用者回貼 ChatGPT；沒有自動同步或 AI API。
原 progress.js 的 localStorage 不更改；新課反思使用 ckad-0001-reflection。
