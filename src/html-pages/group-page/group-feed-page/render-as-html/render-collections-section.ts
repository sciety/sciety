import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { ListCardViewModel, renderListCard } from '../../../../shared-components/list-card';
import { renderListItems } from '../../../../shared-components/render-list-items';

export const renderCollectionsSection = (listCards: ReadonlyArray<ListCardViewModel>): HtmlFragment => pipe(
  listCards,
  RA.map(renderListCard),
  renderListItems,
  (renderedItems) => `
    <section class="group-page-collections">
      <h2>Collections</h2>
      <ol class="card-list" role="list">
        ${renderedItems}
      </ol>
    </section>
  `,
  toHtmlFragment,
);
