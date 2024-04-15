import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { renderErrorAsHtml } from '../../../../shared-components/paper-activity-summary-card/render-error-as-html';
import { renderListItems } from '../../../../shared-components/render-list-items';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { renderPaperActivitySummaryCard } from '../../../../shared-components/paper-activity-summary-card';
import { ViewModel } from '../view-model';
import { PaginationControlsViewModel, renderPaginationControls } from '../../../shared-components/pagination';

const renderCards = (
  paginationControlsViewModel: PaginationControlsViewModel,
) => (
  cards: ReadonlyArray<HtmlFragment>,
) => pipe(
  cards,
  (items) => renderListItems(items),
  (listContent) => `
    <section class="group-page-feed">
      <h2>Latest preprint reviews</h2>
      <ol class="article-list" role="list">
        ${listContent}
      </ol>
    </section>
    ${renderPaginationControls(paginationControlsViewModel)}
  `,
  toHtmlFragment,
);

type RenderListOfArticleCardsWithFallback = (
  content: ViewModel['content'],
)
=> HtmlFragment;

export const renderListOfArticleCardsWithFallback: RenderListOfArticleCardsWithFallback = (content) => {
  if (content.tag === 'no-activity-yet') {
    return toHtmlFragment('<p class="static-message">This group has no activity yet.</p>');
  }
  return pipe(
    content.articleCards,
    RA.map(E.fold(
      renderErrorAsHtml,
      renderPaperActivitySummaryCard,
    )),
    renderCards(content),
  );
};
