# 10. Use Async Hooks to manage request correlation IDs

Date: 2020-07-14

## Status

Accepted

## Context

A single instance of the app can handle multiple HTTP requests at the same time. This means that log lines from
different requests may be interleaved.

## Decision

Generate a unique correlation ID for each request.

Use [Async Hooks] to trace the correlation ID across function calls and all events related to the request–response
cycle.

Fetch the correlation ID when writing a log line.

## Consequences

- The correlation ID doesn't have to be passed around everywhere.
- Might be a hard concept to understand, and that needs to be used with caution.

[Async Hooks]: https://nodejs.org/docs/latest-v14.x/api/async_hooks.html
