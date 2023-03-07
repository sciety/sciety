import * as O from 'fp-ts/Option';
import { ListsTab } from '../view-model';
import { List } from '../../../types/list';
import { UserId } from '../../../types/user-id';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const showCreateNewList = (pageOwner: UserId, loggedInUserId: O.Option<UserId>) => true;

export const constructListsTab = (list: List, pageOwner: UserId, loggedInUserId: O.Option<UserId>): ListsTab => ({
  selector: 'lists',
  listId: list.id,
  articleCount: list.articleIds.length,
  lastUpdated: O.some(list.lastUpdated),
  title: list.name,
  description: list.description,
  articleCountLabel: 'This list contains',
  showCreateNewList: showCreateNewList(pageOwner, loggedInUserId),
});
