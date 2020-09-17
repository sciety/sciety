# Design notes
Read these notes, then take a look at the [live examples of typography and whitespace](./typography-vertical-whitespace-examples.html).

These notes and the examples will evolve.

## Typography

### Font
Fonts chosen for adequate glyph set, readability, and decent italic and bold styles.

#### Body copy
The extended glyph set offered by Noto provides a good safety net for correctly displaying scientific content. This avoids the 'tofu' box browsers display when a glyph isn't available. As serif is preferred over sans for readability, we'll use [Noto Serif](https://fonts.google.com/specimen/Noto+Serif?query=noto+serif).

#### Headings
[Lato's](https://fonts.google.com/specimen/Lato?query=lato) extended Latin character set should be sufficient for the headings, but let's keep a watching brief. The x-height is a bit smaller than Noto Serif, but it's only really slightly noticeable with heading level 6. (If these become a problem we can always switch to Noto Sans.)

### Sizing
- Base font: 16px, line-height of 1.5
- Headings: line height of 1.2
- Heading 1: 38px
- Heading 2: 30px
- Heading 3: 26px
- Heading 4: 22px
- Heading 5: 18px
- Heading 6: 16px


## Vertical spacing
To avoid nasty surprises like margins collapsing, in normal circumstances only add whitespace as bottom margin. If occasionally a top space is absolutely necessary, apply it with padding to avoid margin collapse (unless that's what you want).

We're using an 8px increment for vertical spacing.

- Headings: 2 increments (16px equivalent) margin bottom
- Paragraphs: 3 increments (24px equivalent) margin bottom
- Headings and body copy: zero margin top

## Grid
Grids usually comprise 12 or 16 columns, depending on the complexity of the content to be laid out. The Hive's content is not very complicated, and so a 12 column grid should be more than enough.

### Article grid
This is intended for use on pages where the primary aim is reading large amounts of text, for example article pages and the about page.

This grid has a centered, 8 columns wide main area, giving a line length of 90 - 100 characters, give or take. This is about the upper limit for comfortable reading online.

At the moment, everything lives in this 8-column area. As with everything else, this can be adapted as things evolve.
 

## Component styles
Don't try to solve problems you don't have, but don't ignore the ones you do. Resize the browser a lot, and fix things when they break.

## Notes
We'll need a way of being able to incrementally decouple Semantic-UI and add our own styles without breaking the page presentation. Base font size is a challenge here as the Semantic-UI default of 14px is a bit small. We might be able to get round it by specifying a scaling factor for any rem values for our own styles, until we can change the base font size when Semantic-UI is gone. Handling this could be a good reason to bring in sass.
