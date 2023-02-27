import { PageHeaderViewModel } from '../common-components/page-header';
import { ContentModel } from './content-model';
import { OurListsViewModel } from './render-as-html/render-our-lists';

export type AboutTab = {
  lists: OurListsViewModel,
  markdown: string,
};

export type ViewModel = PageHeaderViewModel & ContentModel & {
  activeTab: AboutTab,
};
