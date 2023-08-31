import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

export type ViewModel = {
  prevPageHref: O.Option<string>,
  nextPageHref: O.Option<string>,
};

const renderOlderLink = (viewModel: ViewModel) => pipe(
  viewModel.nextPageHref,
  O.map(
    (url) => `
      <a href="${url}" class="pagination-controls__next_link">Older<span aria-hidden="true"> →</span></a>
    `,
  ),
);

const renderNewerLink = (viewModel: ViewModel) => pipe(
  viewModel.prevPageHref,
  O.map(
    (url) => `
      <a href="${url}" class="pagination-controls__next_link"><span aria-hidden="true">← </span>Newer</a>
    `,
  ),
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

export const renderPaginationControlsForFeed = (viewModel: ViewModel): HtmlFragment => pipe(
  [
    renderNewerLink(viewModel),
    renderOlderLink(viewModel),
  ],
  toPaginationControls,
  toHtmlFragment,
);
