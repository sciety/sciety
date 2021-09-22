import { htmlEscape } from 'escape-goat';
import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { constant, flow, pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type RenderAuthors = (authors: ReadonlyArray<string>, authorListId: string) => HtmlFragment;

export const renderAuthors: RenderAuthors = (authors, authorListId) => pipe(
  authors,
  RNEA.fromReadonlyArray,
  O.fold(
    constant(''),
    flow(
      RNEA.map((author) => `<li class="card-authors__author">${htmlEscape(author)}</li>`),
      (authorListItems) => `
      <div class="hidden" id="${authorListId}">This article's authors</div>
      <ol class="card-authors" role="list" aria-describedby="${authorListId}">
        ${authorListItems.join('')}
      </ol>
    `,
    ),
  ),
  toHtmlFragment,
);
