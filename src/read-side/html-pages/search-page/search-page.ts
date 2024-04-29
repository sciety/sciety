import { HtmlPage, toHtmlPage } from '../../../html-pages/html-page';
import { renderSearchForm } from '../../../shared-components/search-form';
import { toHtmlFragment } from '../../../types/html-fragment';

export const searchPage: HtmlPage = toHtmlPage({
  title: 'Search',
  content: toHtmlFragment(`
    <header class="page-header page-header--search-results">
      <h1>Search Sciety</h1>
    </header>
    ${renderSearchForm('', true)}
  `),
});
