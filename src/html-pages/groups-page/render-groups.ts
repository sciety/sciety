import { pipe } from 'fp-ts/function';
import { renderListItems } from '../../shared-components/render-list-items';
import { supplementaryCard } from '../../shared-components/supplementary-card';
import { supplementaryInfo } from '../../shared-components/supplementary-info';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { renderListOfCards } from '../shared-components/list-of-cards';

const supplementaryItems = [
  supplementaryCard(
    'Share your insights',
    toHtmlFragment(`
      <p>Join the growing number of journals, societies and preprint review clubs that are making Sciety their home.</p>
      <a href="https://form.jotform.com/Sciety/groups-signup" class="supplementary-card__button_link">Create a group</a>
    `),
  ),
];

export const renderGroups = (groups: ReadonlyArray<HtmlFragment>): HtmlFragment => pipe(
  groups,
  renderListItems,
  renderListOfCards,
  (listOfCards) => `
  <header class="page-header">
    <h1>
      Groups
    </h1>
    <p>A group on Sciety represents a team of scientists who evaluate and curate preprint research articles.</p>
    <p>Select a group to follow their work.</p>
  </header>
  ${listOfCards}
  ${supplementaryInfo(supplementaryItems)}
  `,
  toHtmlFragment,
);
