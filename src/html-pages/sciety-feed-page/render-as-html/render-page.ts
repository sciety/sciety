import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { renderListItems } from '../../../shared-components/render-list-items';
import { renderLegacyPaginationControls } from '../../shared-components/pagination';
import { supplementaryCard } from '../../../shared-components/supplementary-card';
import { supplementaryInfo } from '../../../shared-components/supplementary-info';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { ViewModel } from '../view-model';
import { renderScietyFeedCard } from './render-sciety-feed-card';
import { renderListOfCards } from '../../shared-components/list-of-cards';

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

export const renderPage = (viewModel: ViewModel): HtmlFragment => pipe(
  viewModel.cards,
  RA.map(renderScietyFeedCard),
  renderListItems,
  renderListOfCards,
  (listOfCards) => `
    <header class="page-header">
      <h1>${viewModel.pageHeading}</h1>
    </header>
    <section>
      <p class="sciety-feed-page-numbers">
        Showing page <b>${viewModel.pageNumber}</b> of <b>${viewModel.numberOfPages}</b><span class="visually-hidden"> pages of activity</span>
      </p>
      ${listOfCards}
      ${renderLegacyPaginationControls({
    nextPageHref: pipe(
      viewModel.forwardPage,
      O.map(
        (nextPage) => `/sciety-feed?page=${nextPage}`,
      ),
    ),
  })}
    </section>
    ${supplementaryInfo(supplementaryItems, 'supplementary-info--sciety-feed')}
  `,
  toHtmlFragment,
);
