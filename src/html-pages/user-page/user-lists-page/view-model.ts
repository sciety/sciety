import { ListCardViewModel } from '../../../shared-components/list-card/index.js';
import { GroupId } from '../../../types/group-id.js';
import { UserDetails } from '../../../types/user-details.js';

export type ListsTab = {
  ownedLists: ReadonlyArray<ListCardViewModel>,
  showCreateNewList: boolean,
};

export type ViewModel = ListsTab & {
  userDetails: UserDetails,
  groupIds: ReadonlyArray<GroupId>,
  listCount: number,
};
