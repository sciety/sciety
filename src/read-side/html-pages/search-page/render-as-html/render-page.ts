import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { renderSearchForm } from '../../shared-components/search-form';

const viewModel = {
  title: 'Infectious Diseases (except HIV/AIDS)',
  href: 'https://labs.sciety.org/categories/articles?category=Infectious%20Diseases%20(except%20HIV/AIDS)',
};

const renderSearchCategories = () => `
  <section>
    <a href="${viewModel.href}">${viewModel.title}</a>
  </section>
`;

export const renderPage = (): HtmlFragment => pipe(
  `
    <header class="page-header page-header--search-results">
      <h1>Search Sciety</h1>
    </header>
    ${renderSearchForm('', true)}
    ${process.env.EXPERIMENT_ENABLED === 'true' ? renderSearchCategories() : ''}
  `,
  toHtmlFragment,
);
