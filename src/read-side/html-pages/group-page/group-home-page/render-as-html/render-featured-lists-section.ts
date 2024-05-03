import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../../../../types/html-fragment';
import { ListCardViewModel, renderListCard } from '../../../shared-components/list-card';
import { renderListItems } from '../../../shared-components/list-items';
import { renderListOfCards } from '../../../shared-components/list-of-cards';

export const renderFeaturedListsSection = (listCards: ReadonlyArray<ListCardViewModel>): HtmlFragment => pipe(
  listCards,
  RA.map(renderListCard),
  renderListItems,
  renderListOfCards,
  (listOfCards) => `
    <section class="group-page-featured-lists">
      <h2>Featured lists</h2>
      ${listOfCards}
    </section>
  `,
  toHtmlFragment,
);
