import { ListCardViewModel } from '../../../read-side/html-pages/shared-components/list-card';
import { GroupId } from '../../../types/group-id';
import { UserDetails } from '../../../types/user-details';

export type ListsTab = {
  ownedLists: ReadonlyArray<ListCardViewModel>,
  showCreateNewList: boolean,
};

export type ViewModel = ListsTab & {
  userDetails: UserDetails,
  groupIds: ReadonlyArray<GroupId>,
  listCount: number,
};
