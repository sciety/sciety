import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';

export const renderArticleList = (listContent: HtmlFragment): HtmlFragment => toHtmlFragment(`
  <ol class="article-list" role="list">
    ${listContent}
  </ol>
`);
