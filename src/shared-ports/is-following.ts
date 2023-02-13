import { GroupId } from '../types/group-id';
import { UserId } from '../types/user-id';

export type IsFollowing = (groupId: GroupId) => (userId: UserId) => boolean;
