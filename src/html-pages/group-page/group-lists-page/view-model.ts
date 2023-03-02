import { ListCardViewModel } from '../../../shared-components/list-card/render-list-card';
import { Group } from '../../../types/group';
import { UserId } from '../../../types/user-id';
import { PageHeaderViewModel } from '../common-components/page-header';
import { TabListViewModel } from '../common-components/tab-list';
import { TabsViewModel } from '../common-components/tabs-view-model';

export type Follower = {
  userId: UserId,
  listCount: number,
  followedGroupCount: number,
};

export type ViewModel = PageHeaderViewModel & TabListViewModel & {
  followers: ReadonlyArray<Follower>,
  group: Group,
  listCards: ReadonlyArray<ListCardViewModel>,
  tabs: TabsViewModel,
};
