import { templateListItems } from '../shared-components/list-items';
import { supplementaryInfo } from '../shared-components/supplementary-info';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

const supplementaryItems = [
  toHtmlFragment(`
    <article class="supplementary-card">
      <h2 class="supplementary-card__title">What is a group?</h2>
      <p>A Sciety group is a team of scientists who evaluate, curate and screen research articles.</p>
      <a href="https://blog.sciety.org/sciety-groups/">Read more about Sciety groups</a>.
    </article>
  `),
  toHtmlFragment(`
    <article class="supplementary-card">
      <h2 class="supplementary-card__title">How do groups join sciety?</h2>
      <p>Built for researchers to learn about the latest results, Sciety adds to its growing network by showcasing open preprint evaluations from groups of experts.</p>
      <a href="https://blog.sciety.org/covid-groups/">Read more about how groups are selected for Sciety</a>.
    </article>
  `),
];

export const renderGroups = (groups: ReadonlyArray<HtmlFragment>): HtmlFragment => toHtmlFragment(`
  <header class="page-header">
    <h1>
      Groups
    </h1>
  </header>
  <ol class="group-list" role="list">
    ${templateListItems(groups, 'group-list__item')}
  </ol>
  ${supplementaryInfo(supplementaryItems)}
`);
