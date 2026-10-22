# Tracing service Resource 與 header identity 的必要 bridge

Learner interaction shows that simply stating `app.name → service.name` does not establish the causal chain. Teaching must establish, in order, the host config handoff, Faro `TracingInstrumentation.initialize()` assignment, Resource attribute construction/override order, `WebTracerProvider` ownership, and Tempo Resource visibility before treating the mapping as understood.

The learner also needs a clear contrast: `service.name` is frontend Resource metadata, `traceparent` carries trace/parent identity across process boundaries, and Dashboard Job is independent query/configuration state. Source-level truth must include the `resourceAttributes` override caveat. Place the detailed mapping in the existing tracing ownership Reference, with a bounded Lesson 8 Tempo verification bridge. Preserve Lesson 7's propagation scope and do not advance course mastery from this interaction alone.
