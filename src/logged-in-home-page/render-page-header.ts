import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export const renderPageHeader = (): HtmlFragment => toHtmlFragment(`
  <header class="logged-in-home-page-header">
    <h1>
      Welcome to Sciety
    </h1>
    <p>
      Where research is evaluated and curated by the groups you trust.<br><a href="/about">Learn more about the platform.</a>
    </p>
  </header>
`);
