# 9. Use log levels

Date: 2020-07-14

## Status

Accepted

## Context

Bulky, text-based logs are difficult to interpret or to alert on.

## Decision

Log with these levels:

- error
- warn
- info 
- debug

Consistently use the same [intent for logging levels].

## Consequences

- More log lines can be introduced as filtering is easier.
- Different environments can ignore some levels.

[Intent for logging levels]: https://reflectoring.io/logging-levels/
