import { ListCardViewModel } from '../../shared-components/list-card/render-list-card';
import { AboutTabViewModel } from './about/about';
import { ContentModel } from './content-model';
import { FollowerListViewModel } from './render-as-html/render-followers';

export type ListsTab = {
  selector: 'lists',
  lists: ReadonlyArray<ListCardViewModel>,
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
