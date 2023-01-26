import * as O from 'fp-ts/Option';
import { GroupId } from '../../types/group-id';
import { HtmlFragment } from '../../types/html-fragment';
import { ListId } from '../../types/list-id';
import { UserDetails } from '../../types/user-details';

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
  user: UserDetails,
  mainContent: HtmlFragment,
  groupIds: ReadonlyArray<GroupId>,
  activeTab: ListsTab | FollowingTab,
};
