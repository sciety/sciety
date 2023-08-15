import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type PaginationControls = {
  basePath: string,
  nextPage: O.Option<number>,
};

export const renderPaginationControls = (
  basePath: string,
  nextPage: O.Option<number>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  paginationControls: PaginationControls,
): HtmlFragment => pipe(
  nextPage,
  O.fold(
    () => '',
    (pageNumber) => `<div class="pagination-controls">
      <a href="${basePath}page=${pageNumber}" class="pagination-controls__next_link">Next</a>
    </div>`,
  ),
  toHtmlFragment,
);
