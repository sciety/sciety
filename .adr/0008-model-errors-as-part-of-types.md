# 8. Model errors as part of types

Date: 2020-07-02

## Status

Accepted

## Context

Currently using several different error strategies, e.g. thrown errors, null objects. Neither of these approaches are 
explicit in the types, and it's unclear what the components should be doing.

## Decision

Use the [Option type] and [Result type] patterns where appropriate.

## Consequences

- More standardisation
- Lots of refactoring required
- Component has responsiblity for defining the errors it cares about
- Other errors may still be thrown

[Option type]: https://en.wikipedia.org/wiki/Option_type
[Result type]: https://en.wikipedia.org/wiki/Result_type
