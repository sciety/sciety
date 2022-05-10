import { Doi } from '../types/doi';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type ArticleDetails = {
  doi: Doi,
  title: string,
};

type HeaderViewModel = {
  articleDetails: ArticleDetails,
  saveArticle: HtmlFragment,
  tweetThis: HtmlFragment,
};

export const renderHeader = (viewModel: HeaderViewModel): HtmlFragment => toHtmlFragment(`
  <header class="page-header page-header--article">
    <h1>${viewModel.articleDetails.title}</h1>
  </header>

  <div class="article-actions">
    <a href="https://doi.org/${viewModel.articleDetails.doi.value}" class="full-article-button">Read the full article</a>
    <div class="tweet-and-save-buttons">
      ${viewModel.tweetThis}
      ${viewModel.saveArticle}
    </div>
  </div>
`);
