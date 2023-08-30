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
  O.map(toHtmlFragment),
);

const renderNewerLink = (viewModel: ViewModel) => pipe(
  viewModel.prevPageHref,
  O.map(
    (url) => `
      <a href="${url}" class="pagination-controls__next_link"><span aria-hidden="true">← </span>Newer</a>
    `,
  ),
  O.map(toHtmlFragment),
);

type PaginationLinks = ReadonlyArray<O.Option<HtmlFragment>>;

const renderPaginationControlsDiv = (paginationLinks: PaginationLinks) => pipe(
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
    renderOlderLink(viewModel),
    renderNewerLink(viewModel),
  ],
  renderPaginationControlsDiv,
  toHtmlFragment,
);
