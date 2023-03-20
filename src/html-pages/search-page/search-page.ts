import { renderSearchForm } from '../../shared-components/search-form';
import { toHtmlFragment } from '../../types/html-fragment';
import { Page } from '../../types/page';

export const searchPage: Page = {
  title: 'Search',
  content: toHtmlFragment(`
    <header class="page-header page-header--search-results">
      <h1>Search Sciety</h1>
    </header>
    ${renderSearchForm('', true)}
  `),
};
