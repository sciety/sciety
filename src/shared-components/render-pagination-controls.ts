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
  paginationControls: PaginationControls,
): HtmlFragment => pipe(
  paginationControls.nextPage,
  O.fold(
    () => '',
    (pageNumber) => `<div class="pagination-controls">
      <a href="${paginationControls.basePath}page=${pageNumber}" class="pagination-controls__next_link">Next</a>
    </div>`,
  ),
  toHtmlFragment,
);
