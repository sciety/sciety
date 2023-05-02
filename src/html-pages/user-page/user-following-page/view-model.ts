import * as O from 'fp-ts/Option';
import { GroupCardViewModel } from '../../../shared-components/group-card';
import { GroupId } from '../../../types/group-id';
import { UserDetails } from '../../../types/user-details';

export type FollowingTab = {
  followedGroups: O.Option<ReadonlyArray<GroupCardViewModel>>,
};

export type ViewModel = {
  userDetails: UserDetails,
  groupIds: ReadonlyArray<GroupId>,
  listCount: number,
  activeTab: FollowingTab,
};
