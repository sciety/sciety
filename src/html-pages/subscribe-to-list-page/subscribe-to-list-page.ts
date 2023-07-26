import { toHtmlFragment } from '../../types/html-fragment';
import { Page } from '../../types/page';

export const subscribeToListPage: Page = {
  title: 'Subscribe to a list',
  content: toHtmlFragment(`
    <header class="page-header">
      <h1>Subscribe to a list</h1>
    </header>
    <p>Hello! You caught us before we're ready. If you want us to tell you when it's possible to follow this list, <a href="/contact-us">let us know</a>.</p>
  `),
};
