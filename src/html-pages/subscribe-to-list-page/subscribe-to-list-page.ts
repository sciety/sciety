import { toHtmlFragment } from '../../types/html-fragment';
import { Page } from '../../types/page';

export const subscribeToListPage: Page = {
  title: 'Subscribe to list page',
  content: toHtmlFragment(`
    <header class="page-header">
      <h1>Subscribe to list page</h1>
    </header>
  `),
};
