import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';

export type ViewModel = {
  backwardPageHref: O.Option<string>,
  backwardPageLabel?: string,
  forwardPageHref: O.Option<string>,
  forwardPageLabel?: string,
  page: number,
  pageCount: number,
};

const renderForwardLink = (viewModel: ViewModel) => pipe(
  viewModel.forwardPageHref,
  O.map(
    (url) => `
      <a href="${url}" class="pagination-controls__next_link">${viewModel.forwardPageLabel ?? 'Next'}<span aria-hidden="true"> →</span></a>
    `,
  ),
);

const renderBackwardLink = (viewModel: ViewModel) => pipe(
  viewModel.backwardPageHref,
  O.map(
    (url) => `
      <a href="${url}" class="pagination-controls__next_link"><span aria-hidden="true">← </span>${viewModel.backwardPageLabel ?? 'Previous'}</a>
    `,
  ),
);

const renderPageCount = (viewModel: ViewModel) => (
  `<span class="pagination-controls__page_count">Page ${viewModel.page} of ${viewModel.pageCount}</span>`
);

type PaginationLinks = ReadonlyArray<O.Option<string>>;

const toPaginationControls = (paginationLinks: PaginationLinks) => pipe(
  paginationLinks,
  RA.compact,
  RA.match(
    () => '',
    (links) => pipe(
      links.join(''),
      (content) => `<div class="pagination-controls">
      ${content}
    </div>`,
    ),
  ),
);

export const renderPaginationControls = (viewModel: ViewModel): HtmlFragment => pipe(
  [
    renderBackwardLink(viewModel),
    O.some(renderPageCount(viewModel)),
    renderForwardLink(viewModel),
  ],
  toPaginationControls,
  toHtmlFragment,
);
