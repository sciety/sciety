import { ListCardViewModel } from '../../shared-components/list-card/render-list-card';
import { HtmlFragment } from '../../types/html-fragment';
import { ContentModel } from './content-model';
import { UserCardViewModel } from './followers/render-followers';

type ListsTab = {
  selector: 'lists',
  lists: ReadonlyArray<ListCardViewModel>,
};

type AboutTab = {
  selector: 'about',
};

type FollowersTab = {
  selector: 'followers',
  followerCount: number,
  followers: ReadonlyArray<UserCardViewModel>,
  nextLink: HtmlFragment,
};

export type ActiveTab = ListsTab | AboutTab | FollowersTab;

export type ViewModel = ContentModel & {
  activeTabContent: HtmlFragment,
  isFollowing: boolean,
  activeTab: ActiveTab,
};
