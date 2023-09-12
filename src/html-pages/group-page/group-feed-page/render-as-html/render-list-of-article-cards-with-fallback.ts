import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { renderArticleErrorCard } from '../../../../shared-components/article-card/render-article-error-card';
import { renderListItems } from '../../../../shared-components/render-list-items';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { renderArticleCard } from '../../../../shared-components/article-card';
import { ViewModel } from '../view-model';
import { PaginationControlsForFeedViewModel, renderPaginationControlsForFeed } from '../../../../shared-components/pagination';

const renderCards = (
  paginationControlsForFeedViewModel: PaginationControlsForFeedViewModel,
) => (
  cards: ReadonlyArray<HtmlFragment>,
) => pipe(
  cards,
  (items) => renderListItems(items),
  (listContent) => `
    <section class="group-page-feed">
      <ol class="article-list" role="list">
        ${listContent}
      </ol>
    </section>
    ${renderPaginationControlsForFeed(paginationControlsForFeedViewModel)}
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
      renderArticleErrorCard,
      renderArticleCard,
    )),
    renderCards(content),
  );
};
