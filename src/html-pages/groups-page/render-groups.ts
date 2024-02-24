import { renderListItems } from '../../shared-components/render-list-items.js';
import { supplementaryCard } from '../../shared-components/supplementary-card.js';
import { supplementaryInfo } from '../../shared-components/supplementary-info.js';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment.js';

const supplementaryItems = [
  supplementaryCard(
    'Share your insights',
    toHtmlFragment(`
      <p>Join the growing number of journals, societies and preprint review clubs that are making Sciety their home.</p>
      <a href="https://form.jotform.com/Sciety/groups-signup" class="supplementary-card__button_link">Create a group</a>
    `),
  ),
];

export const renderGroups = (groups: ReadonlyArray<HtmlFragment>): HtmlFragment => toHtmlFragment(`
  <header class="page-header">
    <h1>
      Groups
    </h1>
    <p>A group on Sciety represents a team of scientists who evaluate and curate preprint research articles.</p>
    <p>Select a group to follow their work.</p>
  </header>
  <ol class="card-list" role="list">
    ${renderListItems(groups)}
  </ol>
  ${supplementaryInfo(supplementaryItems)}
`);
