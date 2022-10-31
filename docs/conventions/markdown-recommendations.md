# Recommendations for Markdown use with Sciety

[Markdown](https://daringfireball.net/projects/markdown/) is a simple way of formatting text within documents using typed tags.
Sciety uses Markdown formatting to display text on the website, for example when we ingest content from services like Hypothes.is.

Adhering to these reccomendations when you write Markdown for Sciety ensures that content appears in a consistent and easily readable
format across the site.

## Headings

Ensure there is a space after the hashes:

```markdown
## A heading
```

## Blockquotes

Use a single `>`:

```markdown
> A blockquote
```
> A blockquote


To have multiple paragraphs inside a blockquote, introduce empty lines:

```markdown
> A first paragraph.
>
> A second paragraph.
```
> A first paragraph.
>
> A second paragraph.

For multiline blockquotes either have a `>` before each line:

```markdown
> A long and winding sentence
> split across multiple markdown lines.
```
> A long and winding sentence
> split across multiple markdown lines.

Or indent the subsequent lines to the same level as the text on the first line:

```markdown
> A long and winding sentence
  split across multiple markdown lines.
```
> A long and winding sentence
  split across multiple markdown lines.

## Lists
### Supported List styles
#### Multiple paragraphs within a single list item
Each paragraph in the list item needs to start in the same column as the initial one (in this example align with the `I` in `Imprinted`)
```markdown
1) Imprinted genes that were identified as enriched are not clearly named or listed

   The authors use two or more independent datasets

   The authors discuss how their main aim of identifying expression "hotspots"
2)
```
1) Imprinted genes that were identified as enriched are not clearly named or listed

   The authors use two or more independent datasets

   The authors discuss how their main aim of identifying expression "hotspots"
2)

#### Sublist within a single list item
Each sub list item `-` needs to start in the same column as the outer list item (in this example align with the `I` in `Imprinted`)
```markdown
1) Imprinted genes that were identified as enriched are not clearly named or listed

   - The authors use two or more independent datasets

   - The authors discuss how their main aim of identifying expression "hotspots"
2)
```
1) Imprinted genes that were identified as enriched are not clearly named or listed

   - The authors use two or more independent datasets

   - The authors discuss how their main aim of identifying expression "hotspots"
2)

#### Blockquotes inside list items

All content inside a list item must be indented to the same level.

```markdown
1) A sentence.
   > quote
   >
   > with multiple paragraphs

   Sentence in same list item below the quote.

2) Next list item.
```

1) A sentence.
   > quote
   >
   > with multiple paragraphs

   Sentence in same list item below the quote.

2) Next list item.
