import * as O from 'fp-ts/Option';
import { ListId } from '../../../types/list-id';
import { PageHeaderViewModel } from '../common-components/page-header';
import { TabsViewModel } from '../common-components/tabs-view-model';

export type ListViewModel = {
  listId: ListId,
  articleCount: number,
  updatedAt: Date,
  title: string,
};

export type OurListsViewModel = {
  lists: ReadonlyArray<ListViewModel>,
  allListsUrl: O.Option<string>,
};

export type ViewModel = PageHeaderViewModel & {
  ourLists: OurListsViewModel,
  markdown: string,
  tabs: TabsViewModel,
};
