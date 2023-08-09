import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { renderArticleErrorCard } from '../../../../shared-components/article-card/render-article-error-card';
import { templateListItems } from '../../../../shared-components/list-items';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { ArticleCardViewModel, ArticleErrorCardViewModel, renderArticleCard } from '../../../../shared-components/article-card';

const renderCards = (cards: ReadonlyArray<HtmlFragment>) => pipe(
  cards,
  (items) => templateListItems(items),
  (listContent) => `
    <section class="group-page-lists">
      <ol class="card-list" role="list">
        ${listContent}
      </ol>
    </section>
  `,
  toHtmlFragment,
);

type RenderListOfArticleCardsWithFallback = (
  lists: ReadonlyArray<E.Either<ArticleErrorCardViewModel, ArticleCardViewModel>>
)
=> HtmlFragment;

export const renderListOfArticleCardsWithFallback: RenderListOfArticleCardsWithFallback = RA.match(
  () => toHtmlFragment('<p class="static-message">This group has no activity yet.</p>'),
  (viewModel) => pipe(
    viewModel,
    RA.map(E.fold(
      renderArticleErrorCard,
      renderArticleCard,
    )),
    renderCards,
  ),
);
