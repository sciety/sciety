import { renderAuthors } from './render-authors';
import { langAttributeFor } from '../shared-components/lang-attribute-for';
import { ArticleAuthors } from '../types/article-authors';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type HeaderViewModel = {
  title: string,
  authors: ArticleAuthors,
};

export const renderHeader = (viewModel: HeaderViewModel): HtmlFragment => toHtmlFragment(`
  <header class="page-header page-header--article">
    <h1${langAttributeFor(viewModel.title)}>${viewModel.title}</h1>
    ${renderAuthors(viewModel.authors)}
  </header>
`);
