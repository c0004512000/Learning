"""Reading experiment: make Span data limits deliberately small and visible."""

from opentelemetry import trace
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import SpanLimits, TracerProvider
from opentelemetry.sdk.trace.export import ConsoleSpanExporter, SimpleSpanProcessor


limits = SpanLimits(
    max_span_attributes=3,
    max_events=2,
    max_event_attributes=2,
    max_attribute_length=8,
)
provider = TracerProvider(
    resource=Resource.create({"service.name": "limits-demo"}),
    span_limits=limits,
)
provider.add_span_processor(SimpleSpanProcessor(ConsoleSpanExporter()))
trace.set_tracer_provider(provider)

tracer = trace.get_tracer("training.span-limits", "0.1.0")
with tracer.start_as_current_span("limits.experiment") as span:
    # Five distinct keys compete for three Span attribute slots.
    for index in range(5):
        span.set_attribute(f"app.attr.{index}", f"value-{index}-is-long")

    # Three events compete for two event slots; each event also has a limit.
    for index in range(3):
        span.add_event(
            f"step-{index}",
            {
                "step.index": index,
                "step.label": f"label-{index}-is-long",
                "step.extra": "third-event-attribute",
            },
        )

provider.shutdown()

