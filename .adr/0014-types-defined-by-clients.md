# Types defined by clients

Date: 2020-07-16

## Status

Accepted

## Context

Domain logic and rendering components are difficult to change and to test if they depend
directly on infrastructure modules.

## Decision

In any relationship between modules the caller (client) defines the type of the interface.
The callee (supplier) is responsible for conforming to that type.

In particular, page components define "ports" into which a builder can plug infrastructure modules.

## Consequences

- Infrastructure modules are responsible for providing responses that conform to types defined by components
- The types defined by the components are the "ports" in our Ports and Adapters architecture (see 0013)

