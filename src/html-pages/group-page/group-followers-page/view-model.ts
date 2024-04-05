import { PageHeaderViewModel } from '../common-components/page-header';
import { HtmlFragment } from '../../../types/html-fragment';
import { UserHandle } from '../../../types/user-handle';
import { Group } from '../../../types/group';
import { UserId } from '../../../types/user-id';

export type Follower = {
  userId: UserId,
  listCount: number,
  followedGroupCount: number,
};

export type UserCardViewModel = {
  link: string,
  title: string,
  handle: UserHandle,
  listCount: number,
  followedGroupCount: number,
  avatarUrl: string,
};

export type ViewModel = PageHeaderViewModel & {
  group: Group,
  pageNumber: number,
  followerCount: number,
  followers: ReadonlyArray<UserCardViewModel>,
  nextLink: HtmlFragment,
};
