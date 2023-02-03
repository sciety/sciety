import { ListCardViewModel } from '../../shared-components/list-card/render-list-card';
import { ContentModel } from './content-model';
import { FollowerListViewModel } from './render-as-html/render-followers';
import { OurListsViewModel } from './render-as-html/render-our-lists';

export type ListsTab = {
  selector: 'lists',
  lists: ReadonlyArray<ListCardViewModel>,
};

export type AboutTab = {
  selector: 'about',
  lists: OurListsViewModel,
  markdown: string,
};

type FollowersTab = FollowerListViewModel & {
  selector: 'followers',
};

export type ActiveTab = ListsTab | AboutTab | FollowersTab;

export type ViewModel = ContentModel & {
  isFollowing: boolean,
  activeTab: ActiveTab,
};
