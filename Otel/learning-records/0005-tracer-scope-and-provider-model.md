# Tracer scope and TracerProvider model clarified

使用者針對「為什麼不同程式碼段要不同 Tracer」與「TracerProvider 到底 provide 什麼」提出質疑，修正了先前過度簡化的模型：同一個 Tracer 可以建立許多不同 Span，`get_tracer(name)` 的 name 識別的是 Instrumentation Scope，而 Tracer 不在 Trace tree 裡；TracerProvider 即使只提供一個 Tracer 仍有存在理由，因為它是共用 tracing configuration 的 stateful owner 與 Tracer access point。這使後續可以從 Provider-level 的 Resource、Sampler、SpanProcessor 繼續推導，而不再把「多個 Tracer」誤當成 Provider 的根本存在原因。

## Evidence

使用者先反問是否可以從頭到尾只用同一個 Tracer，並追問 Tracer 在 Trace/Span 圖上代表什麼；接著追問 `TracerProvider()` constructor 本身建立了什麼，以及 Provider 常見會設定哪些共用規則。

## Implications

後續教材應把 Instrumentation Scope 與 Span name 分開教，並把 Provider 的核心責任定義為「集中持有 tracing configuration 並提供 Tracer」。在使用者能自行重述前，Tracer、Instrumentation Scope、TracerProvider 仍不加入 GLOSSARY。
