import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type HeaderViewModel = {
  title: string,
};

export const renderHeader = (viewModel: HeaderViewModel): HtmlFragment => toHtmlFragment(`
  <header class="page-header page-header--article">
    <h1>${viewModel.title}</h1>
  </header>
`);
