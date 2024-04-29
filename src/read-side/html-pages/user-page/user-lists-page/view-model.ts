import { GroupId } from '../../../../types/group-id';
import { UserDetails } from '../../../../types/user-details';
import { ListCardViewModel } from '../../shared-components/list-card';

export type ListsTab = {
  ownedLists: ReadonlyArray<ListCardViewModel>,
  showCreateNewList: boolean,
};

export type ViewModel = ListsTab & {
  userDetails: UserDetails,
  groupIds: ReadonlyArray<GroupId>,
  listCount: number,
};
