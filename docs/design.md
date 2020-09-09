# Design notes
These will evolve.

Frameworks often have a sensible, logical approach to typographical sizing and spacing. Though they're often too opinionated to use easily if working against their grain. Can be used as a source of inspiration for these rules, even if all the implementation is ignored (and it probably should be).

## Typography
- work out body font size, and heading sizes

## Vertical spacing
- once typography is established, try out some line heights and baseline measures / increments to see what works.
- implement the working set of values

## Grid
TBC

## Component styles
Don't try to solve problems you don't have, but don't ignore the ones you do. Resize the browser a lot, and fix things when they break.

## Notes
We'll need a way of being able to incrementally decouple Semantic-UI and add our own styles without breaking the page presentation. Base font size is a challenge here as the Semantic-UI default of 14px is a bit small. We might be able to get round it by specifying a scaling factor for any rem values for our own styles, until we can change the base font size when Semantic-UI is gone. Handling this could be a good reason to bring in sass.
