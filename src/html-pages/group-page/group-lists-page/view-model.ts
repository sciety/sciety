import { ListCardViewModel } from '../../../shared-components/list-card/render-list-card.js';
import { Group } from '../../../types/group.js';
import { PageHeaderViewModel } from '../common-components/page-header.js';
import { TabsViewModel } from '../common-components/tabs-view-model.js';

export type ViewModel = PageHeaderViewModel & {
  group: Group,
  listCards: ReadonlyArray<ListCardViewModel>,
  tabs: TabsViewModel,
};
