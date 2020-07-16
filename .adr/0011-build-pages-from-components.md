# Build website pages from components

Date: 2020-07-16

## Status

Proposed

## Context

The set of pages in the website is relatively stable, but at this stage their contents
are likely to vary rapidly.

## Decision

Structure each page as a set of independent components.

Each component is responsible for fetching data from third parties,
and for completely handling all known possible errors arising from those interactions.

Each component renders itself as a self-contained string of HTML markup.

The top-level renderer for each page composes the components' markup into a layout structure for that page.

## Consequences

- Self-contained components can be quickly added to and removed from pages
- Each component can - and should - handle errors from the third parties with which it interacts
- Multiple components on a page may make the same third-party request, so site performance
  may suffer unless we implement request collapsing and/or caching
- The Koa middleware-based model is less appropriate for implementing this type of architecture

