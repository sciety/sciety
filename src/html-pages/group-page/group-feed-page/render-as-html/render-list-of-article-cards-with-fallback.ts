import * as RA from 'fp-ts/ReadonlyArray';
import { flow, pipe } from 'fp-ts/function';
import { templateListItems } from '../../../../shared-components/list-items';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { ArticleCardViewModel, renderArticleCard } from '../../../../shared-components/article-card';

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

type RenderListOfArticleCardsWithFallback = (lists: ReadonlyArray<ArticleCardViewModel>)
=> HtmlFragment;

export const renderListOfArticleCardsWithFallback: RenderListOfArticleCardsWithFallback = RA.match(
  () => toHtmlFragment('<p class="static-message">This group has no activity yet.</p>'),
  flow(
    RA.map(renderArticleCard),
    renderCards,
  ),
);
