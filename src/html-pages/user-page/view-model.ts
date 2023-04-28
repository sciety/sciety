import * as O from 'fp-ts/Option';
import { ListCardViewModel } from '../../shared-components/list-card/render-list-card';
import { GroupCardViewModel } from '../../shared-components/group-card';
import { GroupId } from '../../types/group-id';
import { UserDetails } from '../../types/user-details';

export type ListsTab = {
  selector: 'lists',
  ownedLists: ReadonlyArray<ListCardViewModel>,
  showCreateNewList: boolean,
};

export type FollowingTab = {
  selector: 'followed-groups',
  followedGroups: O.Option<ReadonlyArray<GroupCardViewModel>>,
};

export type ViewModel = {
  userDetails: UserDetails,
  groupIds: ReadonlyArray<GroupId>,
  listCount: number,
  activeTab: ListsTab | FollowingTab,
};
