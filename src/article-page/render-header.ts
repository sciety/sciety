import { detect } from 'tinyld';
import { renderAuthors } from './render-authors';
import { ArticleAuthors } from '../types/article-authors';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type HeaderViewModel = {
  title: string,
  authors: ArticleAuthors,
};

const langAttributeFor = (title: string): string => {
  const code = detect(title, { only: ['en', 'es', 'pt'] });
  return code === '' ? '' : ` lang="${code}"`;
};

export const renderHeader = (viewModel: HeaderViewModel): HtmlFragment => toHtmlFragment(`
  <header class="page-header page-header--article">
    <h1${langAttributeFor(viewModel.title)}>${viewModel.title}</h1>
    ${renderAuthors(viewModel.authors)}
  </header>
`);
