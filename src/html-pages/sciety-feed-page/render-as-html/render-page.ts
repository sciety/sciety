import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { templateListItems } from '../../../shared-components/list-items';
import { paginationControls } from '../../../shared-components/pagination-controls';
import { supplementaryCard } from '../../../shared-components/supplementary-card';
import { supplementaryInfo } from '../../../shared-components/supplementary-info';
import { toHtmlFragment } from '../../../types/html-fragment';
import { ViewModel } from '../view-model';
import { renderScietyFeedCard } from './render-sciety-feed-card';

const supplementaryItems = [
  supplementaryCard(
    'What is the Sciety feed?',
    toHtmlFragment(`
      <p>
        A feed of events that have happened across the Sciety network. Click on a card to find out more. You can build <a href="/my-feed">your own feed</a> of events relevant to you by following specific groups.
      </p>
    `),
  ),
];

export const renderPage = (viewModel: ViewModel) => pipe(
  viewModel.cards,
  RA.map(renderScietyFeedCard),
  (cards) => `
    <header class="page-header">
      <h1>Sciety Feed</h1>
    </header>
    <section>
      <p class="sciety-feed-page-numbers">
        Showing page <b>${viewModel.pageNumber}</b> of <b>${viewModel.numberOfPages}</b><span class="visually-hidden"> pages of activity</span>
      </p>
      <ol class="card-list">
        ${templateListItems(cards)}
      </ol>
      ${paginationControls('/sciety-feed?', viewModel.nextPage)}
    </section>
    ${supplementaryInfo(supplementaryItems, 'supplementary-info--sciety-feed')}
  `,
  toHtmlFragment,
);
