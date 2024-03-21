import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ViewModel } from '../view-model';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { renderListCard } from '../../../shared-components/list-card';
import { renderListItems } from '../../../shared-components/render-list-items';
import { renderPaginationControls } from '../../../shared-components/pagination';

export const renderPage = (viewModel: ViewModel): HtmlFragment => pipe(
  viewModel.listCards,
  RA.map(renderListCard),
  (cards) => renderListItems(cards),
  (listCards) => `
    <header class="page-header">
      <h1>
        Lists
      </h1>
      <p>Curated collections of preprints selected by Sciety users.</p>
    </header>
    <ol role="list" class="card-list">${listCards}</ol>
    ${renderPaginationControls(viewModel.pagination)}
  `,
  toHtmlFragment,
);
