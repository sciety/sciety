import { ReadModel } from './handle-event';
import { GroupId } from '../../types/group-id';
import { UserId } from '../../types/user-id';

export const isUserAdminOfGroup = (readModel: ReadModel) => (userId: UserId, groupId: GroupId): boolean => {
  const groupsUserIsAdminOf = readModel.byUserId.get(userId);
  return groupsUserIsAdminOf !== undefined && groupsUserIsAdminOf.includes(groupId);
};
