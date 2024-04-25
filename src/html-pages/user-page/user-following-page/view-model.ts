import * as O from 'fp-ts/Option';
import { GroupCardViewModel } from '../../../read-side/html-pages/shared-components/group-card';
import { GroupId } from '../../../types/group-id';
import { UserDetails } from '../../../types/user-details';

export type ViewModel = {
  userDetails: UserDetails,
  groupIds: ReadonlyArray<GroupId>,
  listCount: number,
  followedGroups: O.Option<ReadonlyArray<GroupCardViewModel>>,
};
