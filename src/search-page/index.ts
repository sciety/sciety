import { renderSearchForm } from '../shared-components/render-search-form';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';

export const searchPage: Page = {
  title: 'Search',
  content: toHtmlFragment(`
    <div class="page-content__background">
      <div class="sciety-grid sciety-grid--one-column sciety-grid--search-results">
        <header class="page-header page-header--search-results">
          <h1 class="page-heading--search">Search Sciety</h1>
        </header>
        ${renderSearchForm('')}
      </div>
    </div>
  `),
};
