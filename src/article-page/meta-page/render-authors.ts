import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

export const renderAuthors = (authors: O.Option<ReadonlyArray<string>>): HtmlFragment => pipe(
  authors,
  O.getOrElse<ReadonlyArray<string>>(() => []),
  RA.map((author) => `<li>${author}</li>`),
  (listItems) => listItems.join(''),
  (items) => `<ol aria-label="Authors of this article" class="article-author-list" role="list">${items}</ol>`,
  toHtmlFragment,
);
