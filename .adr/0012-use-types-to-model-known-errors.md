# Use types to model known errors

Date: 2020-07-16

## Status

Proposed

## Context

Throwing exceptions can result in code that is difficult to follow.
It is usually desirable to introduce a class for each kind of exception,
but this creates coupling between infrastructure modules and rendering components.

## Decision

Use types to model the possible known errors arising from third party interactions.

Wrap response data in Result or Maybe objects when data could not be fetched or parsed.

## Consequences

- Client code becomes more "functional", and thus probably easier to test
- The return types from infrastructure functions are more complex

