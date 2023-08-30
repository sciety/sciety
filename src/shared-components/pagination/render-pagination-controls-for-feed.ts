import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

export type ViewModel = {
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

const renderPaginationControlsDiv = (olderLink: O.Option<HtmlFragment>) => pipe(
  olderLink,
  O.fold(
    () => '',
    (link) => `<div class="pagination-controls">
      ${link}
    </div>`,
  ),
);

export const renderPaginationControlsForFeed = (viewModel: ViewModel): HtmlFragment => pipe(
  viewModel,
  renderOlderLink,
  renderPaginationControlsDiv,
  toHtmlFragment,
);
