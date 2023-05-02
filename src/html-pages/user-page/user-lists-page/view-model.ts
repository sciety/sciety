import { ListCardViewModel } from '../../../shared-components/list-card';
import { GroupId } from '../../../types/group-id';
import { UserDetails } from '../../../types/user-details';

export type ListsTab = {
  ownedLists: ReadonlyArray<ListCardViewModel>,
  showCreateNewList: boolean,
};

export type ViewModel = {
  userDetails: UserDetails,
  groupIds: ReadonlyArray<GroupId>,
  listCount: number,
  activeTab: ListsTab,
};
