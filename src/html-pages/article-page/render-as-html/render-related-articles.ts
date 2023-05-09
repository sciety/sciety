import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { templateListItems } from '../../../shared-components/list-items';
import { renderArticleCard } from '../../../shared-components/article-card/render-article-card';
import { ViewModel } from '../view-model';

export const renderRelatedArticles = (viewmodel: ViewModel) => pipe(
  viewmodel.relatedArticles,
  O.match(
    () => '',
    (relatedArticles) => pipe(
      relatedArticles,
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
    ),
  ),
);
