import { HtmlFragment, toHtmlFragment } from './../types/html-fragment';

export const renderExampleSearches = (): HtmlFragment => toHtmlFragment(`
  <p>Search examples: <a href="/search?query=COVID-19">COVID-19</a>, <a href="/search?query=C. elegans">C. elegans</a></p>
`);
