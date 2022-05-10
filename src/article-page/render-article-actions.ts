import { Doi } from '../types/doi';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

const renderFullArticleButton = (doi: Doi) => `
  <a href="https://doi.org/${doi.value}" class="full-article-button">Read the full article</a>
`;

type ArticleActionsViewModel = {
  articleId: Doi,
  saveArticle: HtmlFragment,
  tweetThis: HtmlFragment,
};

export const renderArticleActions = (viewModel: ArticleActionsViewModel): HtmlFragment => toHtmlFragment(`
  <div class="article-actions">
    ${renderFullArticleButton(viewModel.articleId)}
    <div class="tweet-and-save-buttons">
      ${viewModel.tweetThis}
      ${viewModel.saveArticle}
    </div>
  </div>
`);
