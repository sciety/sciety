import * as O from 'fp-ts/Option';
import { ListCardViewModel } from '../../shared-components/list-card/render-list-card';
import { List } from '../../shared-ports/select-all-lists-owned-by';

type ToListCardViewModel = (list: List) => ListCardViewModel;

export const toListCardViewModel: ToListCardViewModel = (list) => ({
  ...list,
  title: list.name,
  articleCount: list.articleIds.length,
  articleCountLabel: 'This list contains',
  lastUpdated: O.some(list.lastUpdated),
});
