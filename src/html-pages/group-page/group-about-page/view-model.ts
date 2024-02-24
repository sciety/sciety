import * as O from 'fp-ts/Option';
import { ListId } from '../../../types/list-id.js';
import { PageHeaderViewModel } from '../common-components/page-header.js';
import { TabsViewModel } from '../common-components/tabs-view-model.js';

type ListViewModel = {
  listId: ListId,
  articleCount: number,
  updatedAt: Date,
  title: string,
  listHref: string,
};

type OurListsViewModel = {
  lists: ReadonlyArray<ListViewModel>,
  allListsUrl: O.Option<string>,
};

export type ViewModel = PageHeaderViewModel & {
  ourLists: OurListsViewModel,
  markdown: string,
  tabs: TabsViewModel,
};
