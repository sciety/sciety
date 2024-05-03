import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { renderArticleList } from '../../shared-components/article-list';
import { renderListItems } from '../../shared-components/list-items';
import { renderAsHtml } from '../../shared-components/paper-activity-summary-card/render-as-html';
import { ViewModel } from '../view-model';

export const renderRelatedArticles = (viewmodel: ViewModel): HtmlFragment => pipe(
  viewmodel.relatedArticles,
  O.match(
    () => '',
    (relatedArticles) => pipe(
      relatedArticles,
      RA.map(renderAsHtml),
      renderListItems,
      (listContent) => `
  <div id="relatedArticles">
    <h2 class="related-articles__header">Related articles</h2>
    ${renderArticleList(listContent)}
  </div>
`,
    ),
  ),
  toHtmlFragment,
);
