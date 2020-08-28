# 16. Introduce in-memory Event Sourcing

Date: 2020-08-27

## Status

Proposed

## Context

The scientific literature domain can be represented with an append-only model.

Part of the application's state can be imported from event feeds representing the work of editorial communities.

## Decision

Model state primarily with immutable [Domain Events][Event Sourcing].

Build projections of these events to satisfy [reads][CQRS].

Reconstitute domain objects from events through event-sourced repositories to accept [writes][CQRS].

## Consequences

Domain Events types are a published interface between the write and read side of the application.

Part of the data in the application is not sourced from events e.g. Editorial Communities descriptions.

[Event Sourcing]: https://docs.microsoft.com/en-us/azure/architecture/patterns/event-sourcing
[CQRS]: https://www.martinfowler.com/bliki/CQRS.html

