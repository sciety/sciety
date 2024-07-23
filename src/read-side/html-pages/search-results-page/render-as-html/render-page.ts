import { pipe } from 'fp-ts/function';
import { renderRelatedGroups } from './render-related-groups';
import { renderSearchResults } from './render-search-results';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { renderSearchForm } from '../../shared-components/search-form';
import { ViewModel } from '../view-model';

export const renderPage = (viewModel: ViewModel): HtmlFragment => pipe(
  `
    <header class="page-header page-header--search-results">
      <h1>Search results</h1>
    </header>
    <section>
      ${renderSearchForm(viewModel.query, viewModel.evaluatedOnly)}
    </section>
    <section class="search-results">
      ${renderSearchResults(viewModel)}
    </section>
    ${renderRelatedGroups(viewModel.relatedGroups)}
  `,
  toHtmlFragment,
);
