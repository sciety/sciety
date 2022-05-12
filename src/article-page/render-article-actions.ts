import { Doi } from '../types/doi';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export const renderFullArticleLink = (doi: Doi): HtmlFragment => toHtmlFragment(`
  <a href="https://doi.org/${doi.value}" class="full-article-button">Read the full article</a>
`);

type ArticleActionsComponents = {
  fullArticleLink: HtmlFragment,
  saveArticle: HtmlFragment,
};

export const renderArticleActions = (components: ArticleActionsComponents): HtmlFragment => toHtmlFragment(`
  <div class="article-actions">
    ${components.fullArticleLink}
    <div class="tweet-and-save-buttons">
      ${components.saveArticle}
    </div>
  </div>
`);
