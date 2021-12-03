import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export const paginationControls = (basePath: string, nextPage: O.Option<number>): HtmlFragment => pipe(
  nextPage,
  O.fold(
    () => '',
    (pageNumber) => `<div class="pagination-controls">
      <a href="${basePath}page=${pageNumber}" class="pagination-controls__next_link">Next</a>
    </div>`,
  ),
  toHtmlFragment,
);
