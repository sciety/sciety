import { ListCardViewModel } from '../../../shared-components/list-card/render-list-card';
import { PageHeaderViewModel } from '../common-components/page-header';
import { TabListViewModel } from '../common-components/tab-list';
import { ContentModel } from './content-model';

export type ListsTab = {
  lists: ReadonlyArray<ListCardViewModel>,
};

export type ViewModel = PageHeaderViewModel & TabListViewModel & ContentModel & {
  activeTab: ListsTab,
};
