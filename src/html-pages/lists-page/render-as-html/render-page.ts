import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ViewModel } from '../view-model';
import { toHtmlFragment } from '../../../types/html-fragment';
import { renderListCard } from '../../../shared-components/list-card';
import { templateListItems } from '../../../shared-components/list-items';

export const renderPage = (viewModel: ViewModel) => pipe(
  viewModel,
  RA.map(renderListCard),
  (cards) => templateListItems(cards),
  (listCards) => `
    <header class="page-header">
      <h1>
        Lists
      </h1>
      <p>Curated collections of preprints selected by Sciety users.</p>
    </header>
    <ol role="list" class="card-list">${listCards}</ol>
  `,
  toHtmlFragment,
);
