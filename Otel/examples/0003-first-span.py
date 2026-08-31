"""Lesson 3: create and export one OpenTelemetry span from Python."""

from opentelemetry import trace
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import SimpleSpanProcessor, ConsoleSpanExporter


def configure_tracing() -> TracerProvider:
    resource = Resource.create({"service.name": "checkout-demo"})
    provider = TracerProvider(resource=resource)
    provider.add_span_processor(SimpleSpanProcessor(ConsoleSpanExporter()))
    trace.set_tracer_provider(provider)
    return provider


def calculate_total(item_prices_cents: list[int], tracer: trace.Tracer) -> int:
    with tracer.start_as_current_span("checkout.calculate_total") as span:
        span.set_attribute("app.cart.item_count", len(item_prices_cents))
        total_cents = sum(item_prices_cents)
        span.set_attribute("app.cart.total_cents", total_cents)
        print(f"Total: {total_cents} cents")
        return total_cents


def main() -> None:
    provider = configure_tracing()
    tracer = trace.get_tracer("training.checkout", "0.1.0")

    calculate_total([1999, 1250, 425], tracer)
    provider.shutdown()


if __name__ == "__main__":
    main()
