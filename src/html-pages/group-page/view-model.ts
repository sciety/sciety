import { AboutTabViewModel } from './about/about';
import { ContentModel } from './content-model';
import { ListsTabViewModel } from './lists/lists';
import { FollowerListViewModel } from './render-as-html/render-followers';

type ListsTab = ListsTabViewModel & {
  selector: 'lists',
};

type AboutTab = AboutTabViewModel & {
  selector: 'about',
};

type FollowersTab = FollowerListViewModel & {
  selector: 'followers',
};

export type ActiveTab = ListsTab | AboutTab | FollowersTab;

export type ViewModel = ContentModel & {
  isFollowing: boolean,
  activeTab: ActiveTab,
};
