# Taiwan Stage Observability learning pages

閱讀入口：`00-start-here.html`

檔案閱讀順序：

1. `00-start-here.html`
2. `01-microservice-dashboard.html`
3. `02-grafana-query-layer.html`
4. `03-prometheus-node-lifecycle.html`
5. `04-node-exporter-full.html`

## Reference / relative link

所有 HTML 都放在同一個 `Observability/Stage/` directory，因此可直接使用相對連結：

```html
<a href="02-grafana-query-layer.html#datasource">...</a>
```

Reference 頁也可以回到主線的特定 anchor：

```html
<a href="01-microservice-dashboard.html#after-query-reference">...</a>
```

在 GitHub Pages 上不需要額外 router 或 JavaScript framework。

## Interactive quiz

Quiz 使用 JavaScript 做即時 feedback，同時保留原生 HTML `<details>` fallback；即使 JS 無法執行，仍可展開答案。
