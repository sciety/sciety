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
      <h3 class="search-results__page_count">
        Showing page <b>${viewModel.pageNumber}</b> of <b>${viewModel.numberOfPages}</b><span class="visually-hidden"> pages of search results</span>
      </h3>
      ${c}
      ${nextLink({ ...viewModel, pageNumber: viewModel.pageNumber + 1 })}
    `
      : c),
  ),
  toHtmlFragment,
);
