import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { renderArticleErrorCard } from '../../../../shared-components/article-card/render-article-error-card';
import { templateListItems } from '../../../../shared-components/list-items';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { renderArticleCard } from '../../../../shared-components/article-card';
import { ViewModel } from '../view-model';
import { PaginationControlsViewModel, renderPaginationControlsForFeed } from '../../../../shared-components/pagination';

const renderCards = (
  paginationControlsViewModel: PaginationControlsViewModel,
) => (
  cards: ReadonlyArray<HtmlFragment>,
) => pipe(
  cards,
  (items) => templateListItems(items),
  (listContent) => `
    <section class="group-page-feed">
      <ol class="card-list" role="list">
        ${listContent}
      </ol>
    </section>
    ${renderPaginationControlsForFeed(paginationControlsViewModel)}
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
