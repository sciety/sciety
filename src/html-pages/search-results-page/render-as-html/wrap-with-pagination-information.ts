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

const renderPageCount = (paginationParameters: PaginationParameters) => (
  (paginationParameters.numberOfPages > 0)
    ? `Showing page <b>${paginationParameters.pageNumber}</b> of <b>${paginationParameters.numberOfPages}</b><span class="visually-hidden"> pages of search results</span>`
    : 'No results found'
);

const renderArticlesSearchResultsHeader = (paginationParameters: PaginationParameters) => `
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
  O.map((cursor) => `/search?query=${encodeURIComponent(viewModel.query)}&category=${viewModel.category}&cursor=${encodeURIComponent(cursor)}${viewModel.evaluatedOnly ? '&evaluatedOnly=true' : ''}&`),
);

const applyHeaderAndFooter = (viewModel: PaginationViewModel) => (c: HtmlFragment) => (viewModel.category === 'articles'
  ? `
      ${renderArticlesSearchResultsHeader(viewModel)}
      ${c}
      ${renderNextLinkOrCallsToAction({ ...viewModel, pageNumber: viewModel.pageNumber + 1 }, buildBasePath(viewModel))}
    `
  : c);

type WrapWithPaginationInformation = (viewModel: PaginationViewModel)
=> (content: O.Option<HtmlFragment>)
=> HtmlFragment;

export const wrapWithPaginationInformation: WrapWithPaginationInformation = (viewModel) => (content) => pipe(
  content,
  O.getOrElse(() => toHtmlFragment('')),
  applyHeaderAndFooter(viewModel),
  toHtmlFragment,
);
