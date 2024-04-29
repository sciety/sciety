import * as O from 'fp-ts/Option';
import { GroupId } from '../../../../types/group-id';
import { UserDetails } from '../../../../types/user-details';
import { GroupCardViewModel } from '../../shared-components/group-card';

export type ViewModel = {
  userDetails: UserDetails,
  groupIds: ReadonlyArray<GroupId>,
  listCount: number,
  followedGroups: O.Option<ReadonlyArray<GroupCardViewModel>>,
};
