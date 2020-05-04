# 4. Model with Domain-Driven Design Aggregates

Date: 2020-05-01

## Status

Proposed

## Context

Solutions (in terms of code) need to match the business models of people to avoid unnecessary translation.

A [monolith] can quickly evolve into a [Big Ball Of Mud] if modularization is insufficient.

## Decision

Follow the [Domain-Driven Design] [Aggregate] pattern.

## Consequences

Organize state via Aggregates rather than [database normalization].

Reference other Aggregates by identity, not object references.

Write transactions that can only span one HTTP request, one Aggregate, one database transaction.

Invariants can only span a single Aggregate.

Use eventual consistency across Aggregate boundaries.

[Aggregate]: https://dddcommunity.org/library/vernon_2011/
[Big Ball Of Mud]: https://www.martinfowler.com/bliki/MonolithFirst.html
[Database normalization]: https://image.slidesharecdn.com/driveyourdbacrazyin3easysteps-111012161437-phpapp01/95/drive-your-dba-crazy-in-3-easy-steps-15-728.jpg?cb=1318493600
[Domain-Driven Design]: https://dddcommunity.org/learning-ddd/what_is_ddd/
[Monolith]: ./0003-monolith.md
