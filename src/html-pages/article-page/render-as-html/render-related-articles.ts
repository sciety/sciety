import * as O from 'fp-ts/Option';
import { toHtmlFragment } from '../../../types/html-fragment';
import { renderArticleCard } from '../../../shared-components/article-card/render-article-card';
import { ViewModel } from '../view-model';
import { Doi } from '../../../types/doi';
import { sanitise } from '../../../types/sanitised-html-fragment';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const renderRelatedArticles = (viewmodel: ViewModel) => `
  <div>
    <h3>Related articles</h3>
    <ol class="card-list" role="list">
      <li>
      ${renderArticleCard({
    articleId: new Doi('10.1101/2023.03.24.534097'),
    title: sanitise(toHtmlFragment('Replication fork plasticity upon replication stress requires rapid nuclear actin polymerization')),
    authors: O.some(['Maria Dilia Palumbieri', 'C. Merigliano']),
    latestVersionDate: O.none,
    latestActivityAt: O.none,
    evaluationCount: 0,
    listMembershipCount: 0,
  })}
      </li>
    </ol>
  </div>
`;
