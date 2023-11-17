import { PageHeaderViewModel } from '../common-components/page-header.js';
import { HtmlFragment } from '../../../types/html-fragment.js';
import { UserHandle } from '../../../types/user-handle.js';
import { TabsViewModel } from '../common-components/tabs-view-model.js';
import { Group } from '../../../types/group.js';
import { UserId } from '../../../types/user-id.js';

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
  tabs: TabsViewModel,
};
