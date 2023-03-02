import { ListCardViewModel } from '../../../shared-components/list-card/render-list-card';
import { Group } from '../../../types/group';
import { PageHeaderViewModel } from '../common-components/page-header';
import { TabsViewModel } from '../common-components/tabs-view-model';

export type ViewModel = PageHeaderViewModel & {
  group: Group,
  listCards: ReadonlyArray<ListCardViewModel>,
  tabs: TabsViewModel,
};
