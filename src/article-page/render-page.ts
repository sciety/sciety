import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export const renderPage = (header: HtmlFragment, articleActions: HtmlFragment, authorsAndAbstract: HtmlFragment) => (mainContent: HtmlFragment): HtmlFragment => toHtmlFragment(`
  ${header}
  ${articleActions}
  ${authorsAndAbstract}
  <div class="main-content">
    ${mainContent}
  </div>
`);
