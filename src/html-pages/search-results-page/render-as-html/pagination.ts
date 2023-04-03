import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { renderNextLinkOrCallsToAction, SearchParameters } from './render-next-link-or-calls-to-action';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { articleServers } from '../../../types/article-server';

const articleServersSeparatedByComma = `<b>${articleServers.biorxiv.name}</b>, <b>${articleServers.medrxiv.name}</b>, <b>${articleServers.researchsquare.name}</b>, <b>${articleServers.scielopreprints.name}</b>`;

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
      <div class="search-results__header_details_item">Results from ${articleServersSeparatedByComma}</div>
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
