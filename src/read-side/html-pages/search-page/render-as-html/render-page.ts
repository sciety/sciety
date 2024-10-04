import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { renderSearchForm } from '../../shared-components/search-form';
import { ViewModel } from '../view-model';

export const renderPage = (viewModel: ViewModel): HtmlFragment => pipe(
  `
    <header class="page-header">
      <h1>${viewModel.pageHeading}</h1>
    </header>
    <section class="explore-page-search-form">
      <h2>Search</h2>
      ${renderSearchForm('', true)}
    </section>
  `,
  toHtmlFragment,
);
