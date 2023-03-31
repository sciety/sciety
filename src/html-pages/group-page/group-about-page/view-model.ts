import * as O from 'fp-ts/Option';
import { ListId } from '../../../types/list-id';
import { PageHeaderViewModel } from '../common-components/page-header';
import { TabsViewModel } from '../common-components/tabs-view-model';
import { ContentModel } from './content-model';

export type ListViewModel = {
  listId: ListId,
  articleCount: number,
  lastUpdated: Date,
  title: string,
};

export type OurListsViewModel = {
  lists: ReadonlyArray<ListViewModel>,
  allListsUrl: O.Option<string>,
};

export type AboutTab = {
  lists: OurListsViewModel,
  markdown: string,
};

export type ViewModel = PageHeaderViewModel & ContentModel & {
  activeTab: AboutTab,
  tabs: TabsViewModel,
};
