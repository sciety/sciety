import { LegacyPaginationControlsViewModel } from '../../../shared-components/pagination';
import { Group } from '../../../types/group';
import { UserHandle } from '../../../types/user-handle';

export type UserCardViewModel = {
  link: string,
  title: string,
  handle: UserHandle,
  listCount: number,
  followedGroupCount: number,
  avatarUrl: string,
};

export type ViewModel = {
  group: Group,
  isFollowing: boolean,
  followerCount: number,
  followers: ReadonlyArray<UserCardViewModel>,
  pagination: LegacyPaginationControlsViewModel,
};
