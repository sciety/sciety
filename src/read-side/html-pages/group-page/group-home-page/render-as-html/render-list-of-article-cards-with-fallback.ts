import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../../../../types/html-fragment';
import {
  ArticleCardViewModel, ArticleErrorCardViewModel, renderArticleCard, renderArticleErrorCard,
} from '../../../shared-components/article-card';
import { renderArticleList } from '../../../shared-components/article-list';
import { renderListItems } from '../../../shared-components/list-items';
import { PaginationControlsViewModel, renderPaginationControls } from '../../../shared-components/pagination';
import { ViewModel } from '../view-model';

const renderArticleCardStack = (
  cards: ReadonlyArray<E.Either<ArticleErrorCardViewModel, ArticleCardViewModel>>,
) => pipe(
  cards,
  RA.map(E.fold(
    renderArticleErrorCard,
    renderArticleCard,
  )),
  (items) => renderListItems(items),
  renderArticleList,
);

const renderGroupFeed = (
  paginationControlsViewModel: PaginationControlsViewModel,
) => (
  feedContent: HtmlFragment,
) => toHtmlFragment(`
  <section class="group-page-feed">
    <h2>Latest preprint reviews</h2>
    ${feedContent}
  </section>
  ${renderPaginationControls(paginationControlsViewModel)}
`);

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
    renderArticleCardStack,
    renderGroupFeed(content),
  );
};
