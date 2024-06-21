import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { renderListItems } from '../../shared-components/list-items';
import { renderSearchForm } from '../../shared-components/search-form';
import { ViewModel } from '../view-model';

const renderSearchCategories = (viewModel: ViewModel) => pipe(
  viewModel,
  RA.map((category) => toHtmlFragment(`<a href="${category.href}">${category.title}</a>`)),
  renderListItems,
  (categories) => `
    <ul role="list" class="search-categories">
      ${categories}
    </ul>
  `,
);

export const renderPage = (viewModel: ViewModel): HtmlFragment => pipe(
  `
    <header class="page-header page-header--search-results">
      <h1>Search Sciety</h1>
    </header>
    ${renderSearchForm('', true)}
    ${process.env.EXPERIMENT_ENABLED === 'true' ? renderSearchCategories(viewModel) : ''}
  `,
  toHtmlFragment,
);
