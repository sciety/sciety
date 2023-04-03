import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { renderNextLinkOrCallsToAction, SearchParameters } from './render-next-link-or-calls-to-action';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';

type PaginationParameters = {
  pageNumber: number,
  numberOfPages: number,
};

export type PaginationViewModel = SearchParameters & PaginationParameters;

const renderArticlesSearchResultsHeader = (paginationParameters: PaginationParameters) => `
  <header class="search-results__header">
    <h3 class="search-results__page_count">
      Showing page <b>${paginationParameters.pageNumber}</b> of <b>${paginationParameters.numberOfPages}</b><span class="visually-hidden"> pages of search results</span>
    </h3>
    <div class="search-results__header_details">
      <div class="search-results__header_details_item">Results from <b>bioRxiv</b>, <b>medRxiv</b>, <b>Research Square</b>, <b>SciELO Preprints</b></div>
      <div class="search-results__header_details_item">Sorted by <b>publication date</b></div>
    </div>
  </header>
`;

type Pagination = (viewModel: PaginationViewModel) => (content: O.Option<HtmlFragment>) => HtmlFragment;

export const pagination: Pagination = (viewModel) => (content) => pipe(
  content,
  O.fold(
    () => '',
    (c: HtmlFragment) => (viewModel.category === 'articles'
      ? `
      ${renderArticlesSearchResultsHeader(viewModel)}
      ${c}
      ${renderNextLinkOrCallsToAction({ ...viewModel, pageNumber: viewModel.pageNumber + 1 })}
    `
      : c),
  ),
  toHtmlFragment,
);
