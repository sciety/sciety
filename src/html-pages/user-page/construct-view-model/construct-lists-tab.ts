import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ListsTab } from '../view-model';
import { List } from '../../../types/list';
import { UserId } from '../../../types/user-id';
import { sortByDefaultListOrdering } from '../../sort-by-default-list-ordering';

const showCreateNewList = (pageOwner: UserId, loggedInUser: O.Option<UserId>) => pipe(
  loggedInUser,
  O.filter((loggedInUserId) => loggedInUserId === pageOwner),
  O.isSome,
);

type ConstructListsTab = (lists: ReadonlyArray<List>, pageOwner: UserId, loggedInUserId: O.Option<UserId>) => ListsTab;

export const constructListsTab: ConstructListsTab = (lists, pageOwner, loggedInUserId) => ({
  selector: 'lists',
  ownedLists: pipe(
    lists,
    sortByDefaultListOrdering,
    RA.map((list) => ({
      listId: list.id,
      articleCount: list.articleIds.length,
      updatedAt: O.some(list.updatedAt),
      title: list.name,
      description: list.description,
      avatarUrl: O.none,
    })),
  ),
  showCreateNewList: showCreateNewList(pageOwner, loggedInUserId),
});
