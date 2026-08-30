"""Record a Histogram measurement inside a sampled Span context."""

from opentelemetry import metrics, trace
from opentelemetry.sdk.metrics import MeterProvider, TraceBasedExemplarFilter
from opentelemetry.sdk.metrics.export import (
    ConsoleMetricExporter,
    PeriodicExportingMetricReader,
)
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import ConsoleSpanExporter, SimpleSpanProcessor
from opentelemetry.sdk.trace.sampling import ALWAYS_ON


resource = Resource.create({"service.name": "checkout"})

trace_provider = TracerProvider(resource=resource, sampler=ALWAYS_ON)
trace_provider.add_span_processor(SimpleSpanProcessor(ConsoleSpanExporter()))
trace.set_tracer_provider(trace_provider)

metric_reader = PeriodicExportingMetricReader(ConsoleMetricExporter())
metric_provider = MeterProvider(
    resource=resource,
    metric_readers=[metric_reader],
    exemplar_filter=TraceBasedExemplarFilter(),
)
metrics.set_meter_provider(metric_provider)

tracer = trace.get_tracer("acme.checkout.application", "0.7.0")
meter = metrics.get_meter("acme.checkout.application", "0.7.0")
duration = meter.create_histogram("app.checkout.duration", unit="ms")

with tracer.start_as_current_span("checkout.place_order"):
    # The current sampled Span makes this measurement exemplar-eligible.
    duration.record(875, {"http.route": "/checkout"})

metric_provider.shutdown()
trace_provider.shutdown()

