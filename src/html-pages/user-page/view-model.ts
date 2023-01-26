import * as O from 'fp-ts/Option';
import { GroupViewModel } from '../../shared-components/group-card/render-group-card';
import { GroupId } from '../../types/group-id';
import { ListId } from '../../types/list-id';
import { UserDetails } from '../../types/user-details';

export type ListsTab = {
  selector: 'lists',
  listId: ListId,
  articleCount: number,
  lastUpdated: O.Option<Date>,
  title: string,
  description: string,
  articleCountLabel: string,
};

export type FollowingTab = {
  selector: 'followed-groups',
  followedGroups: O.Option<ReadonlyArray<GroupViewModel>>,
};

export type ViewModel = {
  userDetails: UserDetails,
  groupIds: ReadonlyArray<GroupId>,
  activeTab: ListsTab | FollowingTab,
};
