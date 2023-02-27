import { HtmlFragment } from '../../../types/html-fragment';
import { UserHandle } from '../../../types/user-handle';
import { ContentModel } from './content-model';

export type UserCardViewModel = {
  link: string,
  title: string,
  handle: UserHandle,
  listCount: number,
  followedGroupCount: number,
  avatarUrl: string,
};

export type FollowersTab = {
  selector: 'followers',
  followerCount: number,
  followers: ReadonlyArray<UserCardViewModel>,
  nextLink: HtmlFragment,
};

export type ViewModel = ContentModel & {
  isFollowing: boolean,
  activeTab: FollowersTab,
};
