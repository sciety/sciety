# 16. Persist Domain Events in a relational database

Date: 2020-08-27

## Status

Proposed

## Context

State is modelled as [Domain Events].

In-memory Domain Events do not survive application restarts.

The team is familiar with open source relational databases.

## Decision

Persist Domain Events in a Postgres relational database.

## Consequences

Domain Events types are more difficult to evolve, as they need to deal with an older immutable version of the data.

Development environments use [Docker Compose] to run a Postgres Docker container.

[Docker Compose]: https://docs.docker.com/compose/
[Domain Events]: ./0016-event-sourcing.md
