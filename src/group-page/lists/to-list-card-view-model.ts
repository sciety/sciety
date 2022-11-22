import * as O from 'fp-ts/Option';
import { ListCardViewModel } from '../../shared-components/list-card/render-list-card';
import { List } from '../../shared-read-models/lists';

type ToListCardViewModel = (list: List) => ListCardViewModel;

export const toListCardViewModel: ToListCardViewModel = (list) => ({
  ...list,
  listId: list.id,
  href: `/lists/${list.id}`,
  title: list.name,
  articleCountLabel: 'This list contains',
  lastUpdated: O.some(list.lastUpdated),
});
