"""Bridge Python logging into OTel and correlate one log with a current Span."""

import logging

from opentelemetry import trace
from opentelemetry._logs import set_logger_provider
from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
from opentelemetry.sdk._logs.export import (
    BatchLogRecordProcessor,
    ConsoleLogRecordExporter,
)
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import ConsoleSpanExporter, SimpleSpanProcessor


resource = Resource.create({"service.name": "checkout"})

trace_provider = TracerProvider(resource=resource)
trace_provider.add_span_processor(SimpleSpanProcessor(ConsoleSpanExporter()))
trace.set_tracer_provider(trace_provider)

log_provider = LoggerProvider(resource=resource)
log_provider.add_log_record_processor(
    BatchLogRecordProcessor(ConsoleLogRecordExporter())
)
set_logger_provider(log_provider)

handler = LoggingHandler(level=logging.NOTSET, logger_provider=log_provider)
logger = logging.getLogger("acme.checkout")
logger.setLevel(logging.INFO)
logger.addHandler(handler)
logger.propagate = False  # Avoid sending the same record to root handlers too.

tracer = trace.get_tracer("acme.checkout.application", "0.8.0")
with tracer.start_as_current_span("checkout.reserve_inventory"):
    logger.warning(
        "Inventory reservation is slow",
        extra={
            "app.inventory.warehouse": "tw-north",
            "app.inventory.elapsed_ms": 820,
        },
    )

log_provider.shutdown()
trace_provider.shutdown()

