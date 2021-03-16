import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';

export const legalPage: Page = {
  title: 'Legal',
  content: toHtmlFragment(`
    <div class="sciety-grid sciety-grid--simple">
      <header class="page-header">
        <h1>Legal</h1>
      </header>
    </div>
  `),
};
