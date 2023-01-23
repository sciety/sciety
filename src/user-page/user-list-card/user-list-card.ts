import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { renderListCard } from '../../shared-components/list-card/render-list-card';
import { HtmlFragment } from '../../types/html-fragment';
import { List } from '../../types/list';

export const userListCard = (list: List): HtmlFragment => pipe(
  {
    listId: list.id,
    articleCount: list.articleIds.length,
    lastUpdated: O.some(list.lastUpdated),
    title: list.name,
    description: list.description,
    articleCountLabel: 'This list contains',
  },
  renderListCard,
);
