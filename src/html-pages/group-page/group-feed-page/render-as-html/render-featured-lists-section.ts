import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { ListCardViewModel, renderListCard } from '../../../../shared-components/list-card';
import { renderListItems } from '../../../../shared-components/render-list-items';

export const renderFeaturedListsSection = (listCards: ReadonlyArray<ListCardViewModel>): HtmlFragment => pipe(
  listCards,
  RA.map(renderListCard),
  renderListItems,
  (renderedItems) => `
    <section class="group-page-featured-lists">
      <h2>Featured lists</h2>
      <ol class="card-list" role="list">
        ${renderedItems}
      </ol>
    </section>
  `,
  toHtmlFragment,
);