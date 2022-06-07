import { templateListItems } from '../shared-components/list-items';
import { supplementaryCard } from '../shared-components/supplementary-card';
import { supplementaryInfo } from '../shared-components/supplementary-info';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

const supplementaryItems = [
  supplementaryCard(
    'What is a group?',
    toHtmlFragment(`
      <p>A Sciety group is a team of scientists who evaluate, curate and screen research articles.</p>
      <a href="https://blog.sciety.org/sciety-groups/">Read more about Sciety groups</a>.
    `),
  ),
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
  </header>

  <form action="" aria-controls="groupList">
    <label for="groupFilter">Filter by group name</label><input type="text" id="groupFilter" aria-label="Filters list by group name as you type">
  </form>

  <p role="status" aria-live="assertive" aria-atomic="true" id="groupListStatus">Showing all groups</p>
  <ol class="group-list" role="list" id="groupList" aria-labelledby="groupListStatus">
    ${templateListItems(groups, 'group-list__item')}
  </ol>
  ${supplementaryInfo(supplementaryItems)}
`);
