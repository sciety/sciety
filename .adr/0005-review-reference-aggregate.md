# 5. Introduce ReviewReference Aggregate

Date: 2020-05-01

## Status

Accepted

## Context

Publishing concerns are deferred in the PRC dancing skeleton to focus on Reviewing.

Review lifecycle management is also deferred to focus on article and review relationships.

## Decision

Introduce a ReviewReference [Aggregate] linking an article DOI and a review DOI together.

Create new instances of this Aggregate to populate the application state.

## Consequences

There is no population phase for articles as any article with a valid DOI can be viewed.

Any article or review property is not stored inside the application state.

All [Queries][CQRS] are dynamically generated from remote resources based on DOIs.

[Aggregate]: https://dddcommunity.org/library/vernon_2011/6
[CQRS]: https://www.martinfowler.com/bliki/CQRS.html
