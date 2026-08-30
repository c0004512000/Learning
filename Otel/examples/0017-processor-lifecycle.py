"""Reading example: make BatchSpanProcessor lifecycle choices explicit."""

from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor


provider = TracerProvider(
    resource=Resource.create({"service.name": "checkout"})
)
exporter = OTLPSpanExporter(endpoint="http://127.0.0.1:4318/v1/traces")
processor = BatchSpanProcessor(
    exporter,
    max_queue_size=256,
    schedule_delay_millis=1_000,
    max_export_batch_size=64,
    export_timeout_millis=5_000,
)
provider.add_span_processor(processor)
trace.set_tracer_provider(provider)

tracer = trace.get_tracer("acme.checkout.application", "0.4.0")
with tracer.start_as_current_span("checkout.reserve"):
    pass

# An exceptional checkpoint can request prompt export without ending the SDK.
flush_completed = provider.force_flush(timeout_millis=3_000)
print(f"force_flush completed: {flush_completed}")

# Normal process termination: flush pending work, then release SDK resources.
provider.shutdown()

