"""Send one trace to a local Collector over OTLP/HTTP.

Prerequisite packages are intentionally not installed by this repository.
The matching lesson explains the dependency and Collector requirements.
"""

from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor


resource = Resource.create({"service.name": "checkout-demo"})
provider = TracerProvider(resource=resource)

# This URL is the Collector's OTLP/HTTP trace endpoint, not a browser page.
exporter = OTLPSpanExporter(endpoint="http://127.0.0.1:4318/v1/traces")
provider.add_span_processor(BatchSpanProcessor(exporter))
trace.set_tracer_provider(provider)

tracer = trace.get_tracer("training.checkout", "0.2.0")

with tracer.start_as_current_span("checkout.calculate_total") as span:
    item_prices_cents = [1299, 875, 1500]
    total_cents = sum(item_prices_cents)
    span.set_attribute("app.cart.item_count", len(item_prices_cents))
    span.set_attribute("app.cart.total_cents", total_cents)

# BatchSpanProcessor exports asynchronously. A controlled shutdown flushes
# buffered spans before this short-lived demo process exits.
provider.shutdown()

