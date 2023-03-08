import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { ListsTab } from '../view-model';
import { List } from '../../../types/list';
import { UserId } from '../../../types/user-id';

const showCreateNewList = (pageOwner: UserId, loggedInUser: O.Option<UserId>) => pipe(
  loggedInUser,
  O.filter((loggedInUserId) => loggedInUserId === pageOwner),
  O.isSome,
);

export const constructListsTab = (list: List, pageOwner: UserId, loggedInUserId: O.Option<UserId>): ListsTab => ({
  selector: 'lists',
  ownedLists: [{
    listId: list.id,
    articleCount: list.articleIds.length,
    lastUpdated: O.some(list.lastUpdated),
    title: list.name,
    description: list.description,
    articleCountLabel: 'This list contains',
  }],
  showCreateNewList: showCreateNewList(pageOwner, loggedInUserId),
});
