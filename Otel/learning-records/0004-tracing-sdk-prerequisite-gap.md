# Trace SDK vocabulary prerequisite identified

使用者已掌握 Trace 的因果模型，但明確指出尚未理解 Tracer、Tracing API、TracerProvider、SDK configuration、SpanProcessor、BatchSpanProcessor、Exporter 與 ConsoleSpanExporter，因此直接進入 Python manual instrumentation 的判斷過早。課程在實作前新增零程式碼的元件角色課，先區分 application startup configuration 與 per-operation runtime flow。

## Evidence

使用者在 2026-08-08 檢視原 Lesson 2 後回饋：「裡面一堆名詞我都不曉得是甚麼意義」，並列出上述未定義術語。
