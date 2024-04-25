import { pipe } from 'fp-ts/function';
import { renderListOfCards } from '../../../../read-side/html-pages/shared-components/list-of-cards';
import { renderListItems } from '../../../../shared-components/render-list-items';
import { HtmlFragment } from '../../../../types/html-fragment';

export const renderFollowList = (list: ReadonlyArray<HtmlFragment>): HtmlFragment => pipe(
  list,
  renderListItems,
  renderListOfCards,
);
