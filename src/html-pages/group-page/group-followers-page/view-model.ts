import { PageHeaderViewModel } from '../common-components/page-header';
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
  followerCount: number,
  followers: ReadonlyArray<UserCardViewModel>,
  nextLink: HtmlFragment,
};

export type ViewModel = PageHeaderViewModel & ContentModel & {
  activeTab: FollowersTab,
};
