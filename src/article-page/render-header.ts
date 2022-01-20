import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type ArticleDetails = {
  title: string,
};

type HeaderViewModel = {
  articleDetails: ArticleDetails,
  badge: HtmlFragment,
  saveArticle: HtmlFragment,
  tweetThis: HtmlFragment,
};

export const renderHeader = (viewModel: HeaderViewModel): HtmlFragment => toHtmlFragment(`
  <header class="page-header page-header--article">
    ${viewModel.badge}
    <h1>${viewModel.articleDetails.title}</h1>
    <div class="article-actions">
      ${viewModel.tweetThis}
      ${viewModel.saveArticle}
    </div>
  </header>
`);
