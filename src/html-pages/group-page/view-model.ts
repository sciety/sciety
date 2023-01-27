import { AboutTabViewModel } from './about/about';
import { ContentModel } from './content-model';
import { FollowerListViewModel } from './followers/render-followers';
import { ListsTabViewModel } from './lists/lists';

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
