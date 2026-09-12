# Linked external source: OTel Faro translator

- canonical source: https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/aad2838d6990eb031e7f4913269c3153cb5c2b4a/pkg/translator/faro/logs_to_faro.go
- ref: pinned source SHA `aad2838d6990eb031e7f4913269c3153cb5c2b4a`
- why it matters: establishes the upstream Faro→OTel log attribute translation and `event_data_` prefix separately from package-side `data-*` key normalization.
