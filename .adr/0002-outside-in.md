# 2. Develop outside-in

Date: 2020-05-01

## Status

Accepted

## Context

Development of layers that are low in the application stack can prove wasteful as they are not hit by scenarios.

As the codebase size increases, refactoring is slowed down.

Code is a liability until code is executed in the real world.

## Decision

Practice [outside-in development] to only write the lines of code necessary to satify the acceptance criteria.

## Consequences

Introduce new layers and concepts as they emerge from [Acceptance Test-Driven Development].

Don't expand the Domain Model state (e.g. properties) until there is a visible feature that makes it necessary.

[Acceptance Test-Driven Development]: https://en.wikipedia.org/wiki/Acceptance_test%E2%80%93driven_development
[Outside-in development]: https://www.informit.com/articles/article.aspx?p=1930038&seqNum=3
