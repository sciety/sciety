import { htmlEscape } from 'escape-goat';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { constant, flow, pipe } from 'fp-ts/function';
import { renderCountWithDescriptor } from '../../../../shared-components/render-count-with-descriptor';
import { ArticleAuthors } from '../../../../types/article-authors';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';

type RenderAuthors = (authors: ArticleAuthors) => HtmlFragment;

export const renderAuthors: RenderAuthors = (authors) => pipe(
  authors,
  O.match(
    constant(''),
    RA.match(
      constant(''),
      flow(
        RNEA.map((author) => `<li class="card-authors__author">${htmlEscape(author)}</li>`),
        (authorListItems) => `
          <div class="visually-hidden">This article has ${renderCountWithDescriptor(authorListItems.length, 'author', 'authors')}:</div>
          <ol class="card-authors" role="list">
            ${authorListItems.join('')}
          </ol>
        `,
      ),
    ),
  ),
  toHtmlFragment,
);
