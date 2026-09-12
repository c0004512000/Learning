# Jeter host integration and tracing chain

## Question / scope

一次記錄 Jeter frontend/backend 的 Faro、user/device、HTTP propagation 與 OTLP 設定，並區分「程式碼配置」與「實際同一 trace」兩種證據。

## Verification metadata

- `verified_at`: 2026-09-12
- source/system: `garmin-tw-mfg-eng/Jeter-Faro-Trace-Demo`
- ref: `dev`
- commit: `3edd27eb44ac2af13d5c987f68e2be232aa0f6dd`
- runtime: Kubernetes `tw-stage/sre-test`, read-only, 2026-09-12

## Verified findings

### Frontend

- `jeter-faro-trace-demo-frontend/src/main.tsx:3-35` 在 React render 前呼叫一次 `initFaro()`，app name `jeter-faro-trace-demo-frontend`、version `1.0.0`。
- `environment` 取自 `FARO_ENVIRONMENT`；`backendUrls` 是 `[new RegExp(BACKEND_URL)]`；`trackAttributes` 是 `['data-link-name']`；`enableDeviceTypeDetection` 為 `true`。
- `getUser()` 讀 `getCurrentUserId()`，有 id 回傳 `{id}`，否則 `null`。`authState.ts:1-41` 證實 runtime `/config.js` 的 `window.__APP_CONFIG__` 優先，其次 Vite env，再其次 local defaults；目前 user id 只存在記憶體。
- `App.tsx:69-84` 在 mock login/logout 更新 current user；`App.tsx:86-109` 以 `${BACKEND_URL}${path}` 呼叫 scenario API。source 的 comment 說明 tracing 對後端 URL 注入 W3C `traceparent`，但並非一筆 runtime trace sample。

### Backend

- `jeter-faro-trace-demo-backend/Program.cs:11-16` 是 ASP.NET Core web app（project target `net10.0`），service name `jeter-faro-trace-demo-backend`，OTLP endpoint 從 `Otlp:Endpoint` 取得。
- `Program.cs:42-48` CORS policy 對設定的 origins 使用 `AllowAnyMethod().AllowAnyHeader()`；`Program.cs:53-66` 啟用 OpenTelemetry tracing（ASP.NET Core + EF Core）及 OpenTelemetry logging，兩者均使用同一個 OTLP exporter endpoint。ASP.NET Core instrumentation filter 排除 `OPTIONS`。
- `Program.cs:102-106` 使用 CORS 並 map controllers。source 沒有自訂 trace-context extractor；parent extraction 若發生，是 ASP.NET Core/OpenTelemetry instrumentation 行為，不能僅憑這段配置宣稱已在 runtime join。
- `appsettings.tw-stage.json:1-7` 的 repository default OTLP endpoint 為 `http://linxpa-pestgk8sm00:30800`；runtime deployment 另以 env 指向 cluster-local `opentelemetry-collector...:4317`，因此應分開記錄 desired/default 與 actual。

### Runtime current state

- `sre-test` frontend image: `linxpa-pestgharbor00.garmin.com/kube/jeter.faro.trace.demo.frontend:v0.0.4`。
- `sre-test` backend image: `linxpa-pestgharbor00.garmin.com/kube/jeter.faro.trace.demo.backend:v0.0.9`。
- Frontend runtime config observed: backend API `https://pek8s-staging.garmin.com/jeter-faro-trace-demo-backend`, Faro environment `tw-stage`; frontend/backend both have cluster-local OTLP collector URL. No Jeter deployment was found in `tw-prod` during this bounded check.

## Evidence

- Frontend init: `jeter-faro-trace-demo-frontend/src/main.tsx:3-35`。
- Runtime config and user state: `jeter-faro-trace-demo-frontend/src/authState.ts:1-41`。
- Login and API calls: `jeter-faro-trace-demo-frontend/src/App.tsx:61-109`。
- Backend instrumentation/CORS/exporter: `jeter-faro-trace-demo-backend/Program.cs:36-66,102-106`。
- Framework and package versions: `jeter-faro-trace-demo-backend/jeter-faro-trace-demo-backend.csproj:1-20`。
- Stage repository endpoint: `jeter-faro-trace-demo-backend/appsettings.tw-stage.json:1-7`。
- Runtime deployments: Kubernetes namespace `sre-test`, deployment specs queried read-only at verification timestamp; secrets omitted.

## Browser → backend → OTLP → Tempo assessment

- **Verified configuration path:** Faro tracing instrumentation receives `backendUrls`; backend is instrumented by ASP.NET Core OpenTelemetry; spans and logs are exported to configured OTLP endpoint. The linked local stack config sends OTLP traces to Tempo (`observability/alloy/config.alloy:19-55`, `observability/otel-collector/otel-collector-config.yaml:11-37`).
- **Not proven at runtime:** a browser request with a concrete `traceparent`, the backend span's parent/trace id, and the corresponding Tempo trace were not captured in this read-only evidence pass. Runtime paired request/response headers plus Tempo lookup are required before teaching “same trace ID” as verified.

## Unknown / not proven

- Actual trace-join success and current Tempo visibility: **INSUFFICIENT; runtime evidence required**。
- Whether Istio/path routing adds or rewrites headers in the deployed environment: no paired network capture was retained, so **Unknown**。
- Jeter production deployment/current production config: not observed in this bounded runtime query, **Unknown**。

## Mission / Course relevance

- 支援 Lesson 4（host user/device/environment integration）。
- 支援 Lesson 7/8（`traceparent` propagation boundary、ASP.NET Core instrumentation、OTLP/Tempo chain；同 trace ID 的 runtime proof 仍是實作活動與 gap）。
- 支援 Lesson 12 troubleshooting（config proves where to inspect, not that runtime delivery succeeded）。
