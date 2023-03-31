import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { nextLink, SearchParameters } from './next-link';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';

export type PaginationViewModel = SearchParameters & {
  pageNumber: number,
  numberOfPages: number,
};

type Pagination = (viewModel: PaginationViewModel) => (content: O.Option<HtmlFragment>) => HtmlFragment;

export const pagination: Pagination = (viewModel) => (content) => pipe(
  content,
  O.fold(
    () => '',
    (c: HtmlFragment) => (viewModel.category === 'articles'
      ? `
      <header class="search-results__header">
        <h3 class="search-results__page_count">
          Showing page <b>${viewModel.pageNumber}</b> of <b>${viewModel.numberOfPages}</b><span class="visually-hidden"> pages of search results</span>
        </h3>
        <div class="search-results__header_details">
          <div class="search-results__header_details_item">Results from <b>bioRxiv</b>, <b>medRxiv</b></div>
          <div class="search-results__header_details_item">Sorted by <b>publication date</b></div>
        </div>
      </header>
      ${c}
      ${nextLink({ ...viewModel, pageNumber: viewModel.pageNumber + 1 })}
    `
      : c),
  ),
  toHtmlFragment,
);
