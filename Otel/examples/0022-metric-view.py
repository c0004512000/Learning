"""Use a View to bound dimensions and choose useful latency buckets."""

from opentelemetry import metrics
from opentelemetry.sdk.metrics import MeterProvider
from opentelemetry.sdk.metrics.export import (
    ConsoleMetricExporter,
    PeriodicExportingMetricReader,
)
from opentelemetry.sdk.metrics.view import (
    ExplicitBucketHistogramAggregation,
    View,
)


latency_view = View(
    instrument_name="app.checkout.duration",
    # Only these measurement keys identify output points for this stream.
    attribute_keys={"http.route", "app.checkout.result"},
    aggregation=ExplicitBucketHistogramAggregation(
        boundaries=[10, 25, 50, 100, 250, 500, 1_000]
    ),
)

reader = PeriodicExportingMetricReader(ConsoleMetricExporter())
provider = MeterProvider(metric_readers=[reader], views=[latency_view])
metrics.set_meter_provider(provider)
meter = metrics.get_meter("acme.checkout.application", "0.6.0")
duration = meter.create_histogram("app.checkout.duration", unit="ms")

duration.record(
    86,
    {
        "http.route": "/checkout/{cart_id}",
        "app.checkout.result": "success",
        # These inputs are intentionally not retained by this View.
        "url.path": "/checkout/cart-8cdb",
        "enduser.id": "user-71823",
    },
)

provider.shutdown()

