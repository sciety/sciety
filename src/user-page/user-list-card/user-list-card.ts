import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { renderListCard } from '../../shared-components/list-card/render-list-card';
import { List } from '../../shared-ports/select-all-lists-owned-by';
import { HtmlFragment } from '../../types/html-fragment';

export const userListCard = (handle: string, list: List): HtmlFragment => pipe(
  {
    listId: list.listId,
    articleCount: list.articleIds.length,
    lastUpdated: O.some(list.lastUpdated),
    userHandle: handle,
    title: list.name,
    description: list.description,
    articleCountLabel: 'This list contains',
  },
  renderListCard,

);
