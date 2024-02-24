import * as RA from 'fp-ts/ReadonlyArray';
import { flow, pipe } from 'fp-ts/function';
import { ListCardViewModel, renderListCard } from '../../../../shared-components/list-card/index.js';
import { renderListItems } from '../../../../shared-components/render-list-items.js';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment.js';

const renderCards = (cards: ReadonlyArray<HtmlFragment>) => pipe(
  cards,
  (items) => renderListItems(items),
  (listContent) => `
    <section class="group-page-lists">
      <ol class="card-list" role="list">
        ${listContent}
      </ol>
    </section>
  `,
  toHtmlFragment,
);

type RenderListOfListCardsWithFallback = (lists: ReadonlyArray<ListCardViewModel>)
=> HtmlFragment;

export const renderListOfListCardsWithFallback: RenderListOfListCardsWithFallback = RA.match(
  () => toHtmlFragment('<p class="static-message">This group doesn\'t have any lists yet.</p>'),
  flow(
    RA.map(renderListCard),
    renderCards,
  ),
);
