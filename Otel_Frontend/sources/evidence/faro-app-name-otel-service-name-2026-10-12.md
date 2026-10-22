# Faro app.name → OpenTelemetry service.name: tracing Resource

## Scope / verification

Verified 2026-10-12 against:
- [Faro Web SDK v2.8.2 TracingInstrumentation](https://github.com/grafana/faro-web-sdk/blob/v2.8.2/packages/web-tracing/src/instrumentation.ts)
- [Faro Web SDK v2.9.0 TracingInstrumentation](https://github.com/grafana/faro-web-sdk/blob/v2.9.0/packages/web-tracing/src/instrumentation.ts)
- [Previously verified internal SDK contract](faro-click-tracking.md), source commit `937d4a32e725877188a8d8a223529dece0449d4d`
- [IDP Portal deployed runtime evidence, §8](idp-portal-keychain-runtime-2026-10-05.md)

This is **source-level verification**, not new deployed trace capture. The private internal SDK file was not re-fetched in this pass; its initialization boundary is based on existing durable workspace evidence and the supplied source excerpt.

## Source chain

1. The host calls internal `initFaro({ app: { name: ... }, ... })`. The internal SDK passes app configuration to Grafana `initializeFaro()` and enables `TracingInstrumentation`.
2. In Grafana `TracingInstrumentation.initialize()`, `this.config.app.name` is read.
3. Faro conditionally assigns the original value to OpenTelemetry's semantic-convention key `ATTR_SERVICE_NAME` (the attribute name `service.name`):

```ts
if (this.config.app.name) {
  attributes[ATTR_SERVICE_NAME] = this.config.app.name;
}
Object.assign(attributes, options.resourceAttributes);
const resource = defaultResource().merge(resourceFromAttributes(attributes));
const provider = new WebTracerProvider({ resource, /* ... */ });
```

4. Resource describes the frontend service associated with spans created by this provider. When telemetry is exported, this resource identity can appear in Tempo as the frontend Resource's `service.name`; this is **not** a `traceparent` header field or a per-span ID.

## Conditions and adjacent mappings

- A missing/empty `app.name` does not take this conditional assignment path.
- By default the mapping preserves exact capitalization/punctuation: `idp-portal` remains `idp-portal`.
- `Object.assign` applies `options.resourceAttributes` **after** the app mapping. If this low-level Faro option specifies `service.name`, it can override the earlier value. The internal SDK's ability to expose that option was not re-verified.
- Same source also maps app namespace/version/environment to `service.namespace`, `service.version`, and `deployment.environment.name` (plus legacy environment compatibility field). This is adjacent implementation context, not proof that those host options are always set.
- Browser `traceparent` serializes trace version/trace ID/parent ID/flags; it does not carry `service.name`. A backend gets its **own** Resource service identity and continues trace identity only through propagation.
- Dashboard `Job` naming is a separate release/configuration path. Loki `service_name` is a downstream log label. Neither should be described as automatically created by this single Faro Resource assignment.

## Production debugging consequence

IDP Portal evidence records deployed `app.name="idp-portal"`, matching Tempo service query `idp-portal`, while `IDP-Portal` yielded no matching trace in the tested query window; the dashboard's Job selection was `IDP-Portal`. This is evidence of a query identity/filter mismatch in that environment, not absence of telemetry.

For a specific request:
1. Capture Browser business request `traceparent` and use exact trace ID to find the Tempo trace.
2. Check frontend Resource `service.name`; do not look for it in `traceparent`.
3. Independently compare frontend span ID with backend parent ID to verify trace join.
4. If a dashboard returns no results, compare its Job/filter literal with actual Resource service name before diagnosing missing telemetry.

Detailed teaching: [Reference 0008](../../reference/0008-faro-tracing-ownership-and-propagation.html#app-name-service-name) and [Lesson 8](../../lessons/0008-verifying-single-trace-browser-to-tempo.html#verify-service-identity).
