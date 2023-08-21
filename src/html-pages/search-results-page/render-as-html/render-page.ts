import { pipe } from 'fp-ts/function';
import { renderSearchResults } from './render-search-results';
import { renderSearchForm } from '../../../shared-components/search-form';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { ViewModel } from '../view-model';

export const renderPage = (viewModel: ViewModel): HtmlFragment => pipe(
  `
    <header class="page-header page-header--search-results">
      <h1>Search Sciety</h1>
    </header>
    ${renderSearchForm(viewModel.query, viewModel.evaluatedOnly)}
    ${viewModel.relatedGroups
    ? `
        <section class="related-groups">
          <h2>Related groups</h2>
          <ul role="list" class="related-groups__list">
            <li role="listitem">
              <a href="/groups/elife">eLife</a>
            </li>
            <li role="listitem">
              <a href="/groups/biophysics-colab">Biophysics Colab</a>
            </li>
          </ul>
        </section>
      `
    : ''}
    <section class="search-results">
      ${renderSearchResults(viewModel)}
    </section>
  `,
  toHtmlFragment,
);
