import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

export const renderPage = (): HtmlFragment => toHtmlFragment(
  `
  <header class="page-header">
    <h1>
      Markdown Preview
    </h1>
  </header>
`,
);
