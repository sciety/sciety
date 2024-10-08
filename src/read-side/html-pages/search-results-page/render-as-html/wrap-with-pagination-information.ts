import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { renderNextLinkOrCallsToAction } from './render-next-link-or-calls-to-action';
import { constructSearchPageHref } from '../../../../standards/paths';
import { articleServers } from '../../../../types/article-server';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';

const articleServersSeparatedByComma = `<b>${articleServers.biorxiv.name}</b>, <b>${articleServers.medrxiv.name}</b>, <b>${articleServers.researchsquare.name}</b>, <b>${articleServers.scielopreprints.name}</b>`;

export type PaginationViewModel = {
  query: string,
  includeUnevaluatedPreprints: boolean,
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

const applyHeaderAndFooter = (viewModel: PaginationViewModel) => (c: HtmlFragment) => `
      ${renderArticlesSearchResultsHeader(viewModel)}
      ${c}
      ${renderNextLinkOrCallsToAction(constructSearchPageHref(viewModel.nextCursor, viewModel.query, viewModel.includeUnevaluatedPreprints, viewModel.pageNumber + 1))}
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
