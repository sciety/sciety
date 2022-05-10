import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type Components = {
  header: HtmlFragment,
  articleActions: HtmlFragment,
  authorsAndAbstract: HtmlFragment,
  mainContent: HtmlFragment,
};

export const renderPage = (components: Components): HtmlFragment => toHtmlFragment(`
  ${components.header}
  ${components.articleActions}
  ${components.authorsAndAbstract}
  <div class="main-content">
    ${components.mainContent}
  </div>
`);
