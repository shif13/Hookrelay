# ADR-0001: Kafka for dispatch, with a Postgres-queue fallback

## Status

Accepted

## Context

Hookrelay needs to dispatch delivery work to workers and let independent
consumers (delivery workers, failure-analysis trigger, live feed) react to the
same outcome events. PostgreSQL is the source of truth for all state.

## Decision

Use Kafka as the transport for dispatch and outcome events. Messages carry IDs,
not payloads. Retry scheduling stays in Postgres (`next_attempt_at`), not in
Kafka retry topics. Kafka does not provide ordering guarantees we depend on.

## Alternatives considered

- Postgres queue (`SELECT ... FOR UPDATE SKIP LOCKED`): simpler, fewer moving
  parts, and sufficient at portfolio scale.
- Redis streams: weaker durability and replay story for this use case.

## Consequences

- Independent consumer groups let the AI analysis path run without touching
  delivery code.
- Consumer lag becomes a first-class backpressure signal.
- More operational complexity than a Postgres queue.
- Fallback: if the schedule slips by a week or more, replace the Kafka
  transport with a Postgres dispatch queue and record the change in a new ADR.
