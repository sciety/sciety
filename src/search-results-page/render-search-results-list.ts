import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { pipe } from 'fp-ts/function';
import { templateListItems } from '../shared-components/list-items';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type PageOfResults = {
  cardsToDisplay: ReadonlyArray<HtmlFragment>,
  pageNumber: number,
  numberOfPages: number,
  category: string,
};

export const renderSearchResultsList = (page: PageOfResults): O.Option<HtmlFragment> => pipe(
  page.cardsToDisplay,
  RNEA.fromReadonlyArray,
  O.map(
    (a) => `
      <ul class="search-results-list" role="list">
        ${templateListItems(a, 'search-results-list__item')}
      </ul>
    `,
  ),
  O.map(toHtmlFragment),
);
