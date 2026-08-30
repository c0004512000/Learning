"""Two telemetry producers inside one service use distinct scopes."""

from opentelemetry import trace
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import ConsoleSpanExporter, SimpleSpanProcessor


provider = TracerProvider(
    resource=Resource.create(
        {
            "service.namespace": "store",
            "service.name": "checkout",
            "service.version": "2.4.1",
        }
    )
)
provider.add_span_processor(SimpleSpanProcessor(ConsoleSpanExporter()))
trace.set_tracer_provider(provider)

# Scope versions identify the instrumentation code, not the deployed service.
checkout_tracer = trace.get_tracer("acme.checkout.application", "0.3.0")
cache_tracer = trace.get_tracer("acme.cache.instrumentation", "1.8.2")

with checkout_tracer.start_as_current_span("checkout.validate_cart"):
    with cache_tracer.start_as_current_span("cache.get") as cache_span:
        cache_span.set_attribute("cache.hit", True)

provider.shutdown()

