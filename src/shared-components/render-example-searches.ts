import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export const renderExampleSearches = (): HtmlFragment => toHtmlFragment(`
  <p>Search examples: <a href="/search?query=COVID-19&evaluatedOnly=true">COVID-19 evaluated articles</a>, <a href="/search?query=C. elegans">All C. elegans articles</a></p>
`);
