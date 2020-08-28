# Infrastructure directory

Date: 2020-07-16

## Status

Accepted

## Context

The code dealing with external requests is usually more imperative than domain logic
or rendering code.

The component rendering code should not need to know the details of interactiion with various third parties.

## Decision

Keep "infrastructure" handling code separate from domain logic and rendering.

Ensure that domain and rendering modules never depend directly on infrastructure modules.
(This is the well-documented [Ports and Adapters architecture] -- also known as
[Hexagonal architecture] or [A-frame architecture].)

## Consequences

- Improved separation of responsibilities
- It should be possible to provide alternative sources of data without affecting the rendering components

[Ports and Adapters architecture]: http://wiki.c2.com/?PortsAndAdaptersArchitecture
[Hexagonal architecture]: https://alistair.cockburn.us/hexagonal-architecture/
[A-frame architecture]: https://www.jamesshore.com/Blog/Testing-Without-Mocks.html#a-frame-arch

