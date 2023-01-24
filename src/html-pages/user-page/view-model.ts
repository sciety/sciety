import { GroupId } from '../../types/group-id';
import { HtmlFragment } from '../../types/html-fragment';

type ListsTab = {
  selector: 'lists',
};

type FollowingTab = {
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
