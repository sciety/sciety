import { templateListItems } from '../../shared-components/list-items';
import { supplementaryCard } from '../../shared-components/supplementary-card';
import { supplementaryInfo } from '../../shared-components/supplementary-info';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

const supplementaryItems = [
  supplementaryCard(
    'How do groups join sciety?',
    toHtmlFragment(`
      <p>Built for researchers to learn about the latest results, Sciety adds to its growing network by showcasing open preprint evaluations from groups of experts.</p>
      <a href="https://blog.sciety.org/covid-groups/">Read more about how groups are selected for Sciety</a>.
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
  <ol class="group-list" role="list">
    ${templateListItems(groups, 'group-list__item')}
  </ol>
  ${supplementaryInfo(supplementaryItems)}
`);
