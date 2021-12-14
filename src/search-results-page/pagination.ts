import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { nextLink, SearchParameters } from './next-link';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export type PaginationViewModel = SearchParameters & {
  pageNumber: number,
  numberOfPages: number,
};

type Pagination = (paginationViewModel: PaginationViewModel) => (content: O.Option<HtmlFragment>) => HtmlFragment;

export const pagination: Pagination = (paginationViewModel) => (content) => pipe(
  content,
  O.fold(
    () => '',
    (c: HtmlFragment) => (paginationViewModel.category === 'articles'
      ? `
      <h3 class="search-results__page_count">
        Showing page ${paginationViewModel.pageNumber} of ${paginationViewModel.numberOfPages}<span class="visually-hidden"> pages of search results</span>
      </h3>
      ${c}
      ${nextLink({ ...paginationViewModel, pageNumber: paginationViewModel.pageNumber + 1 })}
    `
      : c),
  ),
  toHtmlFragment,
);
