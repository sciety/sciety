import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { renderListItems } from '../shared-components/list-items';
import { renderListOfCards } from '../shared-components/list-of-cards';

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
  `,
  toHtmlFragment,
);
