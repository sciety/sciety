import { ListCardViewModel } from '../../../shared-components/list-card/render-list-card';
import { PageHeaderViewModel } from '../common-components/page-header';
import { ContentModel } from './content-model';

export type ListsTab = {
  lists: ReadonlyArray<ListCardViewModel>,
};

export type ViewModel = PageHeaderViewModel & ContentModel & {
  activeTab: ListsTab,
};
