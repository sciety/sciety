import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

export const renderPage = (header: HtmlFragment, authorsAndAbstract: HtmlFragment) => (mainContent: HtmlFragment): HtmlFragment => toHtmlFragment(`
  ${header}
  ${authorsAndAbstract}
  <div class="main-content">
    ${mainContent}
  </div>
`);
