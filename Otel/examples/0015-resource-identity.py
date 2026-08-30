"""Model stable service identity separately from a runtime instance.

This is a reading example. It does not install dependencies or contact a backend.
"""

import os
import uuid

from opentelemetry import trace
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import ConsoleSpanExporter, SimpleSpanProcessor


resource = Resource.create(
    {
        # Stable across horizontally scaled replicas of the same service.
        "service.namespace": "store",
        "service.name": "checkout",

        # Stable for one deployed artifact/cohort, not for all time.
        "service.version": os.environ.get("SERVICE_VERSION", "dev"),
        "deployment.environment.name": os.environ.get(
            "DEPLOYMENT_ENVIRONMENT", "local"
        ),

        # Unique for simultaneously running instances of this logical service.
        "service.instance.id": os.environ.get(
            "SERVICE_INSTANCE_ID", str(uuid.uuid4())
        ),
    }
)

provider = TracerProvider(resource=resource)
provider.add_span_processor(SimpleSpanProcessor(ConsoleSpanExporter()))
trace.set_tracer_provider(provider)

tracer = trace.get_tracer("training.checkout", "0.3.0")
with tracer.start_as_current_span("checkout.validate_cart") as span:
    # This describes one operation, so it belongs on the Span rather than Resource.
    span.set_attribute("app.cart.item_count", 3)

provider.shutdown()

