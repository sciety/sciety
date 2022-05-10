import { renderArticleActions } from './render-article-actions';
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
  ${renderArticleActions({ articleId: viewModel.articleDetails.doi, ...viewModel })}
`);
