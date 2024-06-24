import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../../../../types/html-fragment';
import { renderArticleCard } from '../../../shared-components/article-card';
import { renderErrorAsHtml } from '../../../shared-components/article-card/render-error-as-html';
import { renderArticleList } from '../../../shared-components/article-list';
import { renderListItems } from '../../../shared-components/list-items';
import { PaginationControlsViewModel, renderPaginationControls } from '../../../shared-components/pagination';
import { ViewModel } from '../view-model';

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
      ${renderArticleList(listContent)}
    </section>
    ${renderPaginationControls(paginationControlsViewModel)}
  `,
  toHtmlFragment,
);

type RenderListOfArticleCardsWithFallback = (
  content: ViewModel['feed'],
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
      renderArticleCard,
    )),
    renderCards(content),
  );
};
