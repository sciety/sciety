import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';

export type ViewModel = {
  nextPageHref: string,
};

export const renderLegacyPaginationControls = (viewModel: ViewModel): HtmlFragment => toHtmlFragment(
  `<div class="pagination-controls">
      <a href="${viewModel.nextPageHref}" class="pagination-controls__next_link">Next</a>
    </div>`,
);
