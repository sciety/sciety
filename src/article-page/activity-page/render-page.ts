import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

export const renderPage = (header: HtmlFragment, authorsAndAbstractAndLink: HtmlFragment) => (mainContent: HtmlFragment): HtmlFragment => toHtmlFragment(`
  ${header}
  ${authorsAndAbstractAndLink}
  <div class="main-content">
    ${mainContent}
  </div>
`);
