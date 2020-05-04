# 3. Build a monolith first

Date: 2020-05-01

## Status

Accepted

## Context

We need to be able to evolve the architecture (layers, processes, Domain Models) towards product directions.

Microservices makes refactoring of functionality across their boundaries harder.

## Decision

Follow the [MonolithFirst] pattern.

## Consequences

Refactoring can happen across application layers and responsibilities can be moved between application modules quickly.

Build, testing and deployment remain fast for the short term.

Consider extracting services in the future when/if stable BoundedContexts emerge.

[MonolithFirst]: https://www.martinfowler.com/bliki/MonolithFirst.html
