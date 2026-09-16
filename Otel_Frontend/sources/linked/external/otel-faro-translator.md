# Linked external source: OTel Faro translator

- canonical source: https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/aad2838d6990eb031e7f4913269c3153cb5c2b4a/pkg/translator/faro/logs_to_faro.go
- ref: pinned source SHA `aad2838d6990eb031e7f4913269c3153cb5c2b4a`
- corrected 2026-09-17: `logs_to_faro.go` defines the shared `event_data_` constant and performs **OTel logs→Faro** reverse conversion; it does not establish the forward execution path.
- forward sources at the original pinned SHA: [faro_to_logs.go](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/aad2838d6990eb031e7f4913269c3153cb5c2b4a/pkg/translator/faro/faro_to_logs.go), [keyval.go](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/aad2838d6990eb031e7f4913269c3153cb5c2b4a/pkg/translator/faro/keyval.go). Event fields first enter logfmt body, then the Garmin Collector parser materializes them as attributes.
- dependency-aligned source: Alloy `v1.18.0` uses Faro receiver/translator `v0.153.0`; exact code snippets and resolved commit SHAs are in the [2026-09-17 source investigation](../../evidence/data-link-name-investigation-2026-09-17.md).
