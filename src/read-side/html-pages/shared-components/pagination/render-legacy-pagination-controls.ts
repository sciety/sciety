import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';

export const renderLegacyPaginationControls = (nextPageHref: string): HtmlFragment => toHtmlFragment(
  `<div class="pagination-controls">
      <a href="${nextPageHref}" class="pagination-controls__next_link">Next</a>
    </div>`,
);
