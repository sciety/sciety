import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { renderListItems } from '../../shared-components/list-items';
import { ViewModel } from '../view-model';

const renderBrowseByCategory = (viewModel: ViewModel['browseByCategory']) => pipe(
  viewModel,
  O.match(
    () => '',
    (categories) => pipe(
      categories,
      RA.map((category) => toHtmlFragment(`<a href="${category.href}" class="browse-by-category-list__link">${category.title}</a>`)),
      renderListItems,
      (listContent) => `
    <section class="browse-by-category">
      <ul role="list" class="browse-by-category-list">
        ${listContent}
      </ul>
    </section>
  `,
    ),
  ),
);

export const renderPage = (viewModel: ViewModel): HtmlFragment => pipe(
  `
    <header class="page-header">
      <h1>${viewModel.pageHeading}</h1>
    </header>
    ${renderBrowseByCategory(viewModel.browseByCategory)}
  `,
  toHtmlFragment,
);
