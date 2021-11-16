import { htmlEscape } from 'escape-goat';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { constant, flow, pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type RenderAuthors = (authors: O.Option<ReadonlyArray<string>>, authorListId: string) => HtmlFragment;

export const renderAuthors: RenderAuthors = (authors, authorListId) => pipe(
  authors,
  O.fold(
    constant(''),
    RA.match(
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
  ),
  toHtmlFragment,
);
