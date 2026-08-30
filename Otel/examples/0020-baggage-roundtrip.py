"""Propagate a small, allowlisted Baggage item through an in-memory carrier."""

from opentelemetry import baggage
from opentelemetry.baggage.propagation import W3CBaggagePropagator


propagator = W3CBaggagePropagator()

# Context objects are immutable: set_baggage returns a derived Context.
outbound_context = baggage.set_baggage("app.account.tier", "gold")

# The carrier models HTTP headers without making a network request.
carrier: dict[str, str] = {}
propagator.inject(carrier, context=outbound_context)
print(f"wire carrier: {carrier}")

# A downstream process would receive the carrier and extract a new Context.
inbound_context = propagator.extract(carrier)
tier = baggage.get_baggage("app.account.tier", context=inbound_context)
print(f"downstream tier: {tier}")

# Reading Baggage does not automatically create a Span attribute. If telemetry
# should record this value, instrumentation must copy a reviewed value explicitly.

