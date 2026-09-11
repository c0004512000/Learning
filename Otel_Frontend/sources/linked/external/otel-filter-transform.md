# Linked external source: OTel filter/transform processor semantics

- filter reference: https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/release/v0.101.x/processor/filterprocessor/README.md
- transform reference: https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/release/v0.101.x/processor/transformprocessor/README.md
- ref: `release/v0.101.x`
- why it matters: supports the interpretation that a matching filter condition drops a record and that current `ParseKeyValue`/`merge_maps(..., "upsert")` config is a transform, while runtime ConfigMap evidence supplies the environment-specific truth.
