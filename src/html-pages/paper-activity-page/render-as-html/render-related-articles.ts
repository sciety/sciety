import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { renderListItems } from '../../../shared-components/render-list-items.js';
import { renderAsHtml } from '../../../shared-components/paper-activity-summary-card/render-as-html.js';
import { ViewModel } from '../view-model.js';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment.js';

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
    <ol class="article-list" role="list">
      ${listContent}
    </ol>
  </div>
`,
    ),
  ),
  toHtmlFragment,
);
