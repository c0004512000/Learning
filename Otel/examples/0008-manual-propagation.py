"""Lesson 8: simulate two services and manually propagate trace context."""

from opentelemetry import propagate, trace
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor, ConsoleSpanExporter
from opentelemetry.trace import SpanKind, Tracer


def build_tracing(service_name: str, scope_name: str) -> tuple[TracerProvider, Tracer]:
    provider = TracerProvider(
        resource=Resource.create({"service.name": service_name})
    )
    provider.add_span_processor(BatchSpanProcessor(ConsoleSpanExporter()))
    return provider, provider.get_tracer(scope_name, "0.1.0")


def inventory_service(carrier: dict[str, str], tracer: Tracer) -> None:
    remote_context = propagate.extract(carrier=carrier)

    with tracer.start_as_current_span(
        "GET /inventory/{itemId}",
        context=remote_context,
        kind=SpanKind.SERVER,
    ) as span:
        span.set_attribute("http.request.method", "GET")
        span.set_attribute("http.route", "/inventory/{itemId}")
        span.set_attribute("http.response.status_code", 200)
        print("Inventory service: item is in stock")


def checkout_service(checkout_tracer: Tracer, inventory_tracer: Tracer) -> None:
    with checkout_tracer.start_as_current_span(
        "POST /checkout", kind=SpanKind.SERVER
    ):
        with checkout_tracer.start_as_current_span(
            "GET /inventory/{itemId}", kind=SpanKind.CLIENT
        ):
            carrier: dict[str, str] = {}
            propagate.inject(carrier=carrier)
            print(f"Outgoing carrier: {carrier}")

            # The function call simulates an HTTP boundary. Only carrier data is
            # used to establish the downstream parent relationship.
            inventory_service(carrier, inventory_tracer)


def main() -> None:
    checkout_provider, checkout_tracer = build_tracing(
        "checkout-demo", "training.checkout"
    )
    inventory_provider, inventory_tracer = build_tracing(
        "inventory-demo", "training.inventory"
    )

    checkout_service(checkout_tracer, inventory_tracer)

    checkout_provider.force_flush()
    inventory_provider.force_flush()
    checkout_provider.shutdown()
    inventory_provider.shutdown()


if __name__ == "__main__":
    main()
