import { renderAuthors } from './render-authors';
import { ArticleAuthors } from '../types/article-authors';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type HeaderViewModel = {
  title: string,
  authors: ArticleAuthors,
};

export const renderHeader = (viewModel: HeaderViewModel): HtmlFragment => toHtmlFragment(`
  <header class="page-header page-header--article">
    <h1>${viewModel.title}</h1>
    ${renderAuthors(viewModel.authors)}
  </header>
`);
