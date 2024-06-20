import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { renderSearchForm } from '../../shared-components/search-form';

const viewModel = [
  {
    title: 'Infectious Diseases (except HIV/AIDS)',
    href: 'https://labs.sciety.org/categories/articles?category=Infectious%20Diseases%20(except%20HIV/AIDS)',
  },
  {
    title: 'Epidemiology',
    href: 'https://labs.sciety.org/categories/articles?category=Epidemiology',
  },
];

const renderSearchCategories = () => pipe(
  viewModel,
  RA.map((category) => `<a href="${category.href}">${category.title}</a>`),
  (categories) => `
    <section>
      ${categories.join('')}
    </section>
  `,
);

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
