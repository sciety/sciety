import { GroupId } from '../../types/group-id.js';
import { UserId } from '../../types/user-id.js';

export type FollowCommand = {
  userId: UserId,
  groupId: GroupId,
};
