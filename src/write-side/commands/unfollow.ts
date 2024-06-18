import { GroupId } from '../../types/group-id';
import { UserId } from '../../types/user-id';

export type UnfollowCommand = {
  userId: UserId,
  groupId: GroupId,
};
