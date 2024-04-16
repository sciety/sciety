import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { renderListCard } from '../../../shared-components/list-card';
import { renderListItems } from '../../../shared-components/render-list-items';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { renderListOfCards } from '../../shared-components/list-of-cards';
import { renderPaginationControls } from '../../shared-components/pagination';
import { ViewModel } from '../view-model';

export const renderPage = (viewModel: ViewModel): HtmlFragment => pipe(
  viewModel.listCards,
  RA.map(renderListCard),
  renderListItems,
  renderListOfCards,
  (listOfCards) => `
    <header class="page-header">
      <h1>
        Lists
      </h1>
      <p>Curated collections of preprints selected by Sciety users.</p>
    </header>
    ${listOfCards}
    ${renderPaginationControls(viewModel.pagination)}
  `,
  toHtmlFragment,
);
