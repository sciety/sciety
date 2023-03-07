import * as O from 'fp-ts/Option';
import { ListsTab } from '../view-model';
import { List } from '../../../types/list';

export const constructListsTab = (list: List): ListsTab => ({
  selector: 'lists',
  listId: list.id,
  articleCount: list.articleIds.length,
  lastUpdated: O.some(list.lastUpdated),
  title: list.name,
  description: list.description,
  articleCountLabel: 'This list contains',
  showCreateNewList: true,
});
