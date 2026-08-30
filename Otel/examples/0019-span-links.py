"""Model a batch operation caused by two independent input traces."""

from opentelemetry import trace
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import ConsoleSpanExporter, SimpleSpanProcessor
from opentelemetry.trace import Link


provider = TracerProvider(
    resource=Resource.create({"service.name": "batch-worker"})
)
provider.add_span_processor(SimpleSpanProcessor(ConsoleSpanExporter()))
trace.set_tracer_provider(provider)
tracer = trace.get_tracer("training.links", "0.1.0")

# These two input operations are independent roots with different trace IDs.
with tracer.start_as_current_span("message.receive") as first_input:
    first_context = first_input.get_span_context()

with tracer.start_as_current_span("message.receive") as second_input:
    second_context = second_input.get_span_context()

input_links = [
    Link(first_context, attributes={"app.input.position": 0}),
    Link(second_context, attributes={"app.input.position": 1}),
]

# No current parent exists here. This batch starts a new trace while preserving
# both causal associations as Links supplied at Span creation.
with tracer.start_as_current_span("batch.process", links=input_links) as batch_span:
    batch_span.set_attribute("app.batch.input_count", len(input_links))

provider.shutdown()

