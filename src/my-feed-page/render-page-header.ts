import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export const renderPageHeader = (): HtmlFragment => toHtmlFragment(`
  <header class="page-header">
    <h1>My Feed</h1>
    <p>Never miss a preprint evaluation.</p>
  </header>
`);
