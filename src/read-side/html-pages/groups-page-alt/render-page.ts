import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ViewModel } from './construct-view-model/construct-view-model';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { renderGroupCard } from '../shared-components/group-card';
import { renderListItems } from '../shared-components/list-items';
import { renderListOfCards } from '../shared-components/list-of-cards';
import { renderSupplementaryCard } from '../shared-components/supplementary-card';
import { supplementaryInfo } from '../supplementary-info';

const renderGroupCards = (groupCards: ViewModel['groupCards']) => pipe(
  groupCards,
  RA.map(renderGroupCard),
);

const supplementaryItems = [
  renderSupplementaryCard(
    'Share your insights',
    toHtmlFragment(`
      <p>Join the growing number of journals, societies and preprint review clubs that are making Sciety their home.</p>
      <a href="https://form.jotform.com/Sciety/groups-signup" class="supplementary-card__button_link">Create a group</a>
    `),
  ),
];

export const renderPage = (viewModel: ViewModel): HtmlFragment => pipe(
  viewModel.groupCards,
  renderGroupCards,
  renderListItems,
  renderListOfCards,
  (listOfCards) => `
  <header class="page-header">
    <h1>
      ${viewModel.title}
    </h1>
    <p>A group on Sciety represents a team of scientists who evaluate and curate preprint research articles.</p>
    <p>Select a group to follow their work.</p>
  </header>
  ${listOfCards}
  ${supplementaryInfo(supplementaryItems)}
  `,
  toHtmlFragment,
);
