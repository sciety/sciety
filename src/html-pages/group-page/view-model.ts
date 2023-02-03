import { ListCardViewModel } from '../../shared-components/list-card/render-list-card';
import { HtmlFragment } from '../../types/html-fragment';
import { UserHandle } from '../../types/user-handle';
import { ContentModel } from './content-model';
import { OurListsViewModel } from './render-as-html/render-our-lists';

export type UserCardViewModel = {
  link: string,
  title: string,
  handle: UserHandle,
  listCount: number,
  followedGroupCount: number,
  avatarUrl: string,
};

export type ListsTab = {
  selector: 'lists',
  lists: ReadonlyArray<ListCardViewModel>,
};

export type AboutTab = {
  selector: 'about',
  lists: OurListsViewModel,
  markdown: string,
};

export type FollowersTab = {
  selector: 'followers',
  followerCount: number,
  followers: ReadonlyArray<UserCardViewModel>,
  nextLink: HtmlFragment,
};

export type ActiveTab = ListsTab | AboutTab | FollowersTab;

export type ViewModel = ContentModel & {
  isFollowing: boolean,
  activeTab: ActiveTab,
};
