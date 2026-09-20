# Faro Web SDK baseline capability map — 2026-09-20

## Purpose

建立 Special Lesson 所需的最小 capability boundary：未來的 Frontend Faro Agent Skill 在沒有 project-specific business requirement 時，baseline instrumentation 應該先建立哪些能力；哪些是 Faro Web SDK 本身的 default；哪些需要額外 tracing package／configuration；哪些才屬於 custom instrumentation。

## Version basis

- Project-relevant Faro Web SDK version: `v2.9.0`.
- Primary authoritative source: Grafana Faro Web SDK `v2.9.0` quick start and source.
- This evidence describes SDK capability, not proof that every target repo already has the capability enabled.

## 1. Basic Faro Web SDK baseline

Grafana's `v2.9.0` quick start states that a basic `initializeFaro()` setup automatically collects:

- uncaught errors;
- browser console logs;
- Web Vitals measurements.

The Web SDK console instrumentation source defines these default disabled levels:

```text
DEBUG
TRACE
LOG
```

Therefore the default captured console levels are:

```text
INFO
WARN
ERROR
```

Important consequence for the future Skill:

- `console.info()` and `console.warn()` are baseline log signals;
- `console.error()` is captured by default, but the current implementation converts it to Faro's error/exception path unless `consoleErrorAsLog` is explicitly enabled;
- `console.log()`, `console.debug()`, and `console.trace()` are **not** part of the default console capture set and require configuration if the desired company baseline is "capture every console level".

So "browser console logs" must not be taught as "every `console.*` method is automatically captured".

## 2. API request instrumentation is a separate tracing capability

OpenTelemetry-based HTTP tracing is provided by the separate package:

```text
@grafana/faro-web-tracing
```

Adding `TracingInstrumentation` provides the default OTel browser tracing setup. Grafana documents that this setup includes instrumentation for:

- `fetch` requests;
- `XMLHttpRequest` (XHR) requests;
- W3C trace-context propagation.

This is not the same responsibility as the basic Web SDK console/error instrumentation.

For the future Agent Skill, a useful company baseline is therefore not merely "Faro initialized". It is a capability set:

```text
Web SDK initialized
  + console/error baseline
  + tracing package present
  + fetch/XHR tracing active
  + telemetry receiver configured
  + Grafana visibility verified
```

## 3. `backendUrls` / propagation pattern is not the request-capture list

For same-origin requests, the OTel browser instrumentations can propagate trace context without an extra cross-origin allow-list.

For cross-origin backend requests, `propagateTraceHeaderCorsUrls` controls where the tracing instrumentation is allowed to inject the W3C `traceparent` header. The internal `@sre2/faro-click-tracking` package exposes this concept as `backendUrls`.

Therefore:

```text
HTTP request instrumentation
!=
trace-header propagation target configuration
```

A Skill must not interpret `backendUrls` as "the list of API requests Faro records". It is the project-specific URL pattern used for cross-origin trace-context propagation.

## 4. Baseline versus project-specific customization

The future Skill should separate two layers.

### Baseline layer

Without a special business requirement, inspect or establish:

1. Faro initialization in the actual application entry path.
2. Telemetry receiver / environment configuration.
3. Default console and uncaught-error capture.
4. `TracingInstrumentation` when API request tracing is part of the desired baseline.
5. Fetch/XHR runtime tracing.
6. Cross-origin propagation pattern when the backend is on another origin and distributed tracing is desired.
7. Browser → receiver → storage → Grafana runtime verification.

### Extension layer

When the user asks a business-specific question that baseline signals cannot answer:

```text
business question
  → required additional context
  → choose Faro extension point
  → minimal custom instrumentation
  → runtime verification
```

Possible extension mechanisms include existing instrumentation options, Faro APIs such as `pushLog`, `pushError`, and `pushEvent`, metadata/context APIs, or a custom instrumentation/listener when the requirement genuinely needs new browser behavior.

Foreman's custom click instrumentation is a project-specific example of this extension layer. A complete Foreman case-study derivation is intentionally deferred from the current Special Lesson.

## 5. Teaching boundary for the existing Jeter error evidence

The saved Jeter runtime walkthrough proves one controlled uncaught error reached:

```text
Browser Console
→ Faro exceptions[]
→ /alloy receiver 202
→ Loki / Grafana
```

That runtime evidence remains useful, but it demonstrates one error path. It should not be used as the sole explanation of Faro's broader baseline console capability.

For the Special Lesson, first teach the SDK capability map above, then use the Jeter error walkthrough as one concrete runtime proof.

## Authoritative sources

- Grafana Faro Web SDK v2.9.0 quick start: `https://github.com/grafana/faro-web-sdk/blob/v2.9.0/docs/sources/tutorials/quick-start-browser.md`
- Faro Web SDK v2.9.0 console instrumentation: `https://github.com/grafana/faro-web-sdk/blob/v2.9.0/packages/web-sdk/src/instrumentations/console/instrumentation.ts`
- Grafana Frontend Observability HTTP insights documentation: automatic HTTP request instrumentation through tracing instrumentation (`fetch` / XHR).
- Existing project evidence: `trace-context-propagation.md`, `faro-click-tracking.md`, `special-lesson-visual-runtime-2026-09-20.md`.
