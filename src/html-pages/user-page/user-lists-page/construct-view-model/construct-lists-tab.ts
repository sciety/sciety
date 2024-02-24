import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ListsTab } from '../view-model.js';
import { List } from '../../../../read-models/lists/index.js';
import { UserId } from '../../../../types/user-id.js';
import { sortByDefaultListOrdering } from '../../../sort-by-default-list-ordering.js';
import { constructListCardViewModelWithoutAvatar } from '../../../../shared-components/list-card/index.js';

const showCreateNewList = (pageOwner: UserId, loggedInUser: O.Option<UserId>) => pipe(
  loggedInUser,
  O.filter((loggedInUserId) => loggedInUserId === pageOwner),
  O.isSome,
);

type ConstructListsTab = (lists: ReadonlyArray<List>, pageOwner: UserId, loggedInUserId: O.Option<UserId>) => ListsTab;

export const constructListsTab: ConstructListsTab = (lists, pageOwner, loggedInUserId) => ({
  ownedLists: pipe(
    lists,
    sortByDefaultListOrdering,
    RA.map(constructListCardViewModelWithoutAvatar),
  ),
  showCreateNewList: showCreateNewList(pageOwner, loggedInUserId),
});
