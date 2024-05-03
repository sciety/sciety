import * as RA from 'fp-ts/ReadonlyArray';
import { flow, pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../../../../types/html-fragment';
import { ListCardViewModel, renderListCard } from '../../../shared-components/list-card';
import { renderListItems } from '../../../shared-components/list-items';
import { renderListOfCards } from '../../../shared-components/list-of-cards';

const renderCards = (cards: ReadonlyArray<HtmlFragment>) => pipe(
  cards,
  renderListItems,
  renderListOfCards,
  (listOfCards) => `
    <section class="group-page-lists">
      ${listOfCards}
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
