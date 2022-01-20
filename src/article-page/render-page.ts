import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export const renderPage = (header: HtmlFragment) => (mainContent: HtmlFragment): HtmlFragment => toHtmlFragment(`
  ${header}
  <div class="main-content">
    ${mainContent}
  </div>
`);
