import { detect } from 'tinyld';
import { renderAuthors } from './render-authors';
import { ArticleAuthors } from '../types/article-authors';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type HeaderViewModel = {
  title: string,
  authors: ArticleAuthors,
};

const inferLanguageCode = (title: string): string => detect(title, { only: ['en', 'es', 'pt'] });

export const renderHeader = (viewModel: HeaderViewModel): HtmlFragment => toHtmlFragment(`
  <header class="page-header page-header--article">
    <h1 lang="${inferLanguageCode(viewModel.title)}">${viewModel.title}</h1>
    ${renderAuthors(viewModel.authors)}
  </header>
`);
