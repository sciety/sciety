import * as O from 'fp-ts/Option';
import { GroupCardViewModel } from '../../../shared-components/group-card/index.js';
import { GroupId } from '../../../types/group-id.js';
import { UserDetails } from '../../../types/user-details.js';

export type ViewModel = {
  userDetails: UserDetails,
  groupIds: ReadonlyArray<GroupId>,
  listCount: number,
  followedGroups: O.Option<ReadonlyArray<GroupCardViewModel>>,
};
