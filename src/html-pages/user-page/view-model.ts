import * as O from 'fp-ts/Option';
import { GroupId } from '../../types/group-id';
import { HtmlFragment } from '../../types/html-fragment';
import { ListId } from '../../types/list-id';

export type ListsTab = {
  selector: 'lists',
  listId: ListId,
  articleCount: number,
  lastUpdated: O.Option<Date>,
  title: string,
  description: string,
  articleCountLabel: string,
};

export type FollowingTab = {
  selector: 'followed-groups',
};

export type ViewModel = {
  avatarUrl: string,
  displayName: string,
  handle: string,
  mainContent: HtmlFragment,
  groupIds: ReadonlyArray<GroupId>,
  activeTab: ListsTab | FollowingTab,
};
