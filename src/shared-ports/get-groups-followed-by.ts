import { GroupId } from '../types/group-id';
import { UserId } from '../types/user-id';

export type GetGroupsFollowedBy = (userId: UserId) => ReadonlyArray<GroupId>;
