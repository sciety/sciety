import { Doi } from '../types/doi';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

const renderFullArticleButton = (doi: Doi) => `
  <a href="https://doi.org/${doi.value}" class="full-article-button">Read the full article</a>
`;

type ArticleDetails = {
  doi: Doi,
  title: string,
};

type HeaderViewModel = {
  articleDetails: ArticleDetails,
  saveArticle: HtmlFragment,
  tweetThis: HtmlFragment,
};

const renderArticleActions = (viewModel: HeaderViewModel) => `
  <div class="article-actions">
    ${renderFullArticleButton(viewModel.articleDetails.doi)}
    <div class="tweet-and-save-buttons">
      ${viewModel.tweetThis}
      ${viewModel.saveArticle}
    </div>
  </div>
`;

export const renderHeader = (viewModel: HeaderViewModel): HtmlFragment => toHtmlFragment(`
  <header class="page-header page-header--article">
    <h1>${viewModel.articleDetails.title}</h1>
  </header>
  ${renderArticleActions(viewModel)}
`);
