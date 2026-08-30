"""Model checkout traffic with Counter, UpDownCounter, and Histogram."""

from opentelemetry import metrics
from opentelemetry.sdk.metrics import MeterProvider
from opentelemetry.sdk.metrics.export import (
    ConsoleMetricExporter,
    PeriodicExportingMetricReader,
)
from opentelemetry.sdk.resources import Resource


reader = PeriodicExportingMetricReader(ConsoleMetricExporter())
provider = MeterProvider(
    resource=Resource.create({"service.name": "checkout"}),
    metric_readers=[reader],
)
metrics.set_meter_provider(provider)
meter = metrics.get_meter("acme.checkout.application", "0.5.0")

request_counter = meter.create_counter(
    "app.checkout.requests", unit="1", description="Completed checkout requests"
)
active_requests = meter.create_up_down_counter(
    "app.checkout.active_requests", unit="1", description="In-flight requests"
)
duration = meter.create_histogram(
    "app.checkout.duration", unit="ms", description="Checkout duration"
)


def record_checkout(duration_ms: float, result: str) -> None:
    stable_attributes = {"app.checkout.result": result}
    active_requests.add(1)
    try:
        duration.record(duration_ms, stable_attributes)
        request_counter.add(1, stable_attributes)
    finally:
        active_requests.add(-1)


record_checkout(42.0, "success")
record_checkout(315.0, "failure")
provider.shutdown()

