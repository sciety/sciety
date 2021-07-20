import { flow } from 'fp-ts/function';
import { toHtmlFragment } from '../types/html-fragment';

export const paginationControls = flow(
  (nextLink: string) => `<div class="pagination-controls">
      <a href="${nextLink}" class="pagination-controls__next_link">Next</a>
    </div>`,
  toHtmlFragment,
);
