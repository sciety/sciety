import { templateListItems } from '../shared-components/list-items';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

const supplementaryInfo = `
  <aside class="supplementary-info">
    <ul class="supplementary-list" role="list">
      <li class="supplementary-list__item">
        <article class="supplementary-card">
          <h2 class="supplementary-card__title">What is a group?</h2>
          <p>A Sciety group is a team of scientists who evaluate, curate and screen research articles.</p>
          <a href="https://blog.sciety.org/sciety-groups/">Read more about Sciety groups</a>.
        </article>
      </li>
      <li class="supplementary-list__item">
        <article class="supplementary-card">
          <h2 class="supplementary-card__title">How do groups join sciety?</h2>
          <p>Built for researchers to learn about the latest results, Sciety adds to its growing network by showcasing open preprint evaluations from groups of experts.</p>
          <a href="https://blog.sciety.org/covid-groups/">Read more about how groups are selected for Sciety</a>.
        </article>
      </li>
    </ul>
  </aside>
`;

export const renderGroups = (groups: ReadonlyArray<HtmlFragment>): HtmlFragment => toHtmlFragment(`
  <header class="page-header">
    <h1>
      Groups
    </h1>
  </header>
  <ol class="group-list" role="list">
    ${templateListItems(groups, 'group-list__item')}
  </ol>
  ${supplementaryInfo}
`);
