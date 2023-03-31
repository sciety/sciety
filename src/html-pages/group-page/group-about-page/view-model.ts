import * as O from 'fp-ts/Option';
import { ListId } from '../../../types/list-id';
import { PageHeaderViewModel } from '../common-components/page-header';
import { TabsViewModel } from '../common-components/tabs-view-model';
import { List } from '../../../types/list';
import { Group } from '../../../types/group';

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
  ourLists: OurListsViewModel,
  markdown: string,
};

export type ViewModel = PageHeaderViewModel & {
  activeTab: AboutTab,
  group: Group,
  lists: ReadonlyArray<List>,
  tabs: TabsViewModel,
};
