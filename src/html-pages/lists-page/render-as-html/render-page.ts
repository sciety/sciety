import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ViewModel } from '../view-model.js';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment.js';
import { renderListCard } from '../../../shared-components/list-card/index.js';
import { renderListItems } from '../../../shared-components/render-list-items.js';

export const renderPage = (viewModel: ViewModel): HtmlFragment => pipe(
  viewModel,
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
  `,
  toHtmlFragment,
);
