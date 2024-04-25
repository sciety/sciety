import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { List } from '../../../../read-models/lists';
import { constructListCardViewModelWithoutCurator } from '../../../../read-side/html-pages/shared-components/list-card';
import { UserDetails } from '../../../../types/user-details';
import { UserId } from '../../../../types/user-id';
import { sortByDefaultListOrdering } from '../../../sort-by-default-list-ordering';
import { ListsTab } from '../view-model';

const showCreateNewList = (pageOwner: UserId, loggedInUser: O.Option<UserId>) => pipe(
  loggedInUser,
  O.filter((loggedInUserId) => loggedInUserId === pageOwner),
  O.isSome,
);

type ConstructListsTab = (
  lists: ReadonlyArray<List>,
  pageOwner: UserDetails,
  loggedInUserId: O.Option<UserId>,
) => ListsTab;

export const constructListsTab: ConstructListsTab = (lists, pageOwner, loggedInUserId) => ({
  ownedLists: pipe(
    lists,
    sortByDefaultListOrdering,
    RA.map(constructListCardViewModelWithoutCurator),
  ),
  showCreateNewList: showCreateNewList(pageOwner.id, loggedInUserId),
});
