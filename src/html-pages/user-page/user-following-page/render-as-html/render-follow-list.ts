import { pipe } from 'fp-ts/function';
import { HtmlFragment } from '../../../../types/html-fragment';
import { renderListItems } from '../../../../shared-components/render-list-items';
import { renderListOfCards } from '../../../shared-components/list-of-cards';

export const renderFollowList = (list: ReadonlyArray<HtmlFragment>): HtmlFragment => pipe(
  list,
  renderListItems,
  renderListOfCards,
);
