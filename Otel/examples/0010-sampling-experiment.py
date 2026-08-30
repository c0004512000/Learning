"""Lesson 10: observe recording, sampled flags, and parent-based consistency."""

from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor, ConsoleSpanExporter
from opentelemetry.sdk.trace.sampling import (
    DEFAULT_OFF,
    DEFAULT_ON,
    ParentBasedTraceIdRatio,
    Sampler,
)


def run_case(label: str, sampler: Sampler, root_count: int) -> None:
    provider = TracerProvider(
        sampler=sampler,
        resource=Resource.create({"service.name": f"sampling-{label}"}),
    )
    provider.add_span_processor(BatchSpanProcessor(ConsoleSpanExporter()))
    tracer = provider.get_tracer("training.sampling", "0.1.0")

    sampled_roots = 0
    for index in range(root_count):
        with tracer.start_as_current_span(
            "checkout.request",
            attributes={"app.case": label, "app.iteration": index},
        ) as root:
            root_context = root.get_span_context()
            sampled_roots += int(root_context.trace_flags.sampled)

            with tracer.start_as_current_span("checkout.validate") as child:
                child_context = child.get_span_context()
                print(
                    f"{label:10} #{index:02d} "
                    f"root(recording={root.is_recording()}, "
                    f"sampled={root_context.trace_flags.sampled}) "
                    f"child(sampled={child_context.trace_flags.sampled})"
                )

    provider.force_flush()
    provider.shutdown()
    print(f"{label}: sampled {sampled_roots}/{root_count} root traces\n")


def main() -> None:
    run_case("always_on", DEFAULT_ON, root_count=2)
    run_case("always_off", DEFAULT_OFF, root_count=2)
    run_case("ratio_25", ParentBasedTraceIdRatio(0.25), root_count=12)


if __name__ == "__main__":
    main()
