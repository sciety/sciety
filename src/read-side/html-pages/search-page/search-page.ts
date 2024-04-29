import { toHtmlFragment } from '../../../types/html-fragment';
import { HtmlPage, toHtmlPage } from '../html-page';
import { renderSearchForm } from '../shared-components/search-form';

export const searchPage: HtmlPage = toHtmlPage({
  title: 'Search',
  content: toHtmlFragment(`
    <header class="page-header page-header--search-results">
      <h1>Search Sciety</h1>
    </header>
    ${renderSearchForm('', true)}
  `),
});
