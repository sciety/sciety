import { GroupId } from '../../types/group-id';
import { UserId } from '../../types/user-id';

export type FollowCommand = {
  userId: UserId,
  groupId: GroupId,
};
