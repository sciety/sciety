import { pipe } from 'fp-ts/function';
import { renderSearchResults } from './render-search-results.js';
import { renderSearchForm } from '../../../shared-components/search-form/index.js';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment.js';
import { ViewModel } from '../view-model.js';
import { renderRelatedGroups } from './render-related-groups.js';

export const renderPage = (viewModel: ViewModel): HtmlFragment => pipe(
  `
    <header class="page-header page-header--search-results">
      <h1>Search Sciety</h1>
    </header>
    ${renderSearchForm(viewModel.query, viewModel.evaluatedOnly)}
    <section class="search-results">
      ${renderSearchResults(viewModel)}
    </section>
    ${renderRelatedGroups(viewModel.relatedGroups)}
  `,
  toHtmlFragment,
);
