import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
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
    ${viewModel.relatedGroups.length !== 0
    ? pipe(
      viewModel.relatedGroups,
      RA.map((relatedGroup) => `
        <li role="listitem">
          <a href="${relatedGroup.path}">${relatedGroup.name}</a>
        </li>
      `),
      (items) => items.join(''),
      (listContent) => `
        <section class="related-groups">
          <h2>Related groups</h2>
          <ul role="list" class="related-groups__list">
          ${listContent}
          </ul>
        </section>
      `,
    )
    : ''}
    <section class="search-results">
      ${renderSearchResults(viewModel)}
    </section>
  `,
  toHtmlFragment,
);
