import * as O from 'fp-ts/Option';
import { renderPaginationControlsForFeed } from '../../shared-components/pagination/render-pagination-controls-for-feed';
import { toHtmlFragment } from '../../types/html-fragment';
import { Page } from '../../types/page';

export const styleGuidePage: Page = {
  title: 'Style guide',
  content: toHtmlFragment(`
    <header class="page-header">
      <h1>Style guide</h1>
    </header>
    <h2>Pagination controls for feed</h2>
    ${renderPaginationControlsForFeed({ nextPageHref: O.some('/foo') })}
  `),
};
