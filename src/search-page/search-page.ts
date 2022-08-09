import * as T from 'fp-ts/Task';
import { renderSearchForm } from '../shared-components/render-search-form';
import { toHtmlFragment } from '../types/html-fragment';
import { PageAsPartials } from '../types/page-as-partials';

export const searchPage: PageAsPartials = {
  title: T.of('Search'),
  first: T.of(toHtmlFragment(`
    <header class="page-header page-header--search-results">
      <h1>Search Sciety</h1>
    </header>
    ${renderSearchForm('', false)}
  `)),
  second: T.of(toHtmlFragment('')),
};
