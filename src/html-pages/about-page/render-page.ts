import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment.js';
import { blogLinks, callToAction, content } from './content.js';

export const renderPage = (): HtmlFragment => toHtmlFragment(
  `
  <header class="page-header">
    <h1>
      About Sciety
    </h1>
  </header>
  <div>
    ${content}
    ${callToAction}
    ${blogLinks}
  </div>
`,
);
