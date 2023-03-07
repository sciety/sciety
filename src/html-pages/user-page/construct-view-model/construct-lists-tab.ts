import * as O from 'fp-ts/Option';
import { ListsTab } from '../view-model';
import { List } from '../../../types/list';
import { UserDetails } from '../../../types/user-details';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const showCreateNewList = (pageOwner: UserDetails) => true;

export const constructListsTab = (list: List, pageOwner: UserDetails): ListsTab => ({
  selector: 'lists',
  listId: list.id,
  articleCount: list.articleIds.length,
  lastUpdated: O.some(list.lastUpdated),
  title: list.name,
  description: list.description,
  articleCountLabel: 'This list contains',
  showCreateNewList: showCreateNewList(pageOwner),
});
