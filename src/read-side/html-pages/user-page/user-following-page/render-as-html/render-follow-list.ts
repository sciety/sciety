import { pipe } from 'fp-ts/function';
import { renderListItems } from '../../../../../shared-components/render-list-items';
import { HtmlFragment } from '../../../../../types/html-fragment';
import { renderListOfCards } from '../../../shared-components/list-of-cards';

export const renderFollowList = (list: ReadonlyArray<HtmlFragment>): HtmlFragment => pipe(
  list,
  renderListItems,
  renderListOfCards,
);
