import { GroupId } from '../types/group-id';
import { UserId } from '../types/user-id';

export type GetFollowers = (groupId: GroupId) => ReadonlyArray<UserId>;
