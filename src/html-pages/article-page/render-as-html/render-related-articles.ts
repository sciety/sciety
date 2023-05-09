import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { templateListItems } from '../../../shared-components/list-items';
import { toHtmlFragment } from '../../../types/html-fragment';
import { renderArticleCard } from '../../../shared-components/article-card/render-article-card';
import { ViewModel } from '../view-model';
import { Doi } from '../../../types/doi';
import { sanitise } from '../../../types/sanitised-html-fragment';

const hardcodedRelatedArticles = [
  {
    articleId: new Doi('10.1101/2023.03.24.534097'),
    title: sanitise(toHtmlFragment('Replication fork plasticity upon replication stress requires rapid nuclear actin polymerization')),
    authors: O.some(['Maria Dilia Palumbieri', 'C. Merigliano']),
    latestVersionDate: O.none,
    latestActivityAt: O.none,
    evaluationCount: 0,
    listMembershipCount: 0,
  },
  {
    articleId: new Doi('10.1101/2023.03.21.533689'),
    title: sanitise(toHtmlFragment('An endocytic myosin essential for plasma membrane invagination powers motility against resistance')),
    authors: O.some(['Ross T A Pedersen', 'Aaron Snoberger']),
    latestVersionDate: O.none,
    latestActivityAt: O.none,
    evaluationCount: 0,
    listMembershipCount: 0,
  },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const renderRelatedArticles = (viewmodel: ViewModel) => pipe(
  hardcodedRelatedArticles,
  RA.map(renderArticleCard),
  templateListItems,
  (listContent) => `
  <div>
    <h3>Related articles</h3>
    <ol class="card-list" role="list">
      ${listContent}
    </ol>
  </div>
`,
);
