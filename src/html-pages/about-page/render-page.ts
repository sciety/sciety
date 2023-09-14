import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { blogLinks, callToAction, content } from './content';

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
