import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { renderNextLinkOrCallsToAction } from './render-next-link-or-calls-to-action.js';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment.js';
import { articleServers } from '../../../types/article-server.js';

const articleServersSeparatedByComma = `<b>${articleServers.biorxiv.name}</b>, <b>${articleServers.medrxiv.name}</b>, <b>${articleServers.researchsquare.name}</b>, <b>${articleServers.scielopreprints.name}</b>`;

export type PaginationViewModel = {
  query: string,
  evaluatedOnly: boolean,
  nextCursor: O.Option<string>,
  pageNumber: number,
  numberOfPages: number,
};

const renderPageCount = (paginationParameters: PaginationViewModel) => (
  (paginationParameters.numberOfPages > 0)
    ? `Showing page <b>${paginationParameters.pageNumber}</b> of <b>${paginationParameters.numberOfPages}</b><span class="visually-hidden"> pages of search results</span>`
    : 'No results found'
);

const renderArticlesSearchResultsHeader = (paginationParameters: PaginationViewModel) => `
  <header class="search-results__header">
    <h3 class="search-results__page_count">
      ${renderPageCount(paginationParameters)}
    </h3>
    <div class="search-results__header_details">
      <div class="search-results__header_details_item">Results from ${articleServersSeparatedByComma}</div>
      <div class="search-results__header_details_item">Sorted by <b>publication date</b></div>
    </div>
  </header>
`;

export const buildBasePath = (viewModel: PaginationViewModel): O.Option<string> => pipe(
  viewModel.nextCursor,
  O.map((cursor) => `/search?query=${encodeURIComponent(viewModel.query)}&cursor=${encodeURIComponent(cursor)}${viewModel.evaluatedOnly ? '&evaluatedOnly=true' : ''}&`),
);

const applyHeaderAndFooter = (viewModel: PaginationViewModel) => (c: HtmlFragment) => `
      ${renderArticlesSearchResultsHeader(viewModel)}
      ${c}
      ${renderNextLinkOrCallsToAction(viewModel.pageNumber + 1, buildBasePath(viewModel))}
    `;

type WrapWithPaginationInformation = (viewModel: PaginationViewModel)
=> (content: O.Option<HtmlFragment>)
=> HtmlFragment;

export const wrapWithPaginationInformation: WrapWithPaginationInformation = (viewModel) => (content) => pipe(
  content,
  O.getOrElse(() => toHtmlFragment('')),
  applyHeaderAndFooter(viewModel),
  toHtmlFragment,
);
