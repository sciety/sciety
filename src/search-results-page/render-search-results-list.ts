import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { constant, pipe } from 'fp-ts/function';
import { templateListItems } from '../shared-components/list-items';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type PageOfResults = {
  cardsToDisplay: ReadonlyArray<HtmlFragment>,
  pageNumber: number,
  numberOfPages: number,
  category: string,
};

export const renderSearchResultsList = (page: PageOfResults): HtmlFragment => pipe(
  page.cardsToDisplay,
  RNEA.fromReadonlyArray,
  O.fold(
    constant(''),
    (a) => `
      ${page.category === 'articles'
    ? `<h3 class="search-results__page_count">
            Showing page ${page.pageNumber} of ${page.numberOfPages}<span class="visually-hidden"> pages of search results</span>
          </h3>`
    : ''
}
      <ul class="search-results-list" role="list">
        ${templateListItems(a, 'search-results-list__item')}
      </ul>
    `,
  ),
  toHtmlFragment,
);
