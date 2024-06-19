import { ReadModel } from './handle-event';
import { GroupId } from '../../types/group-id';
import { UserId } from '../../types/user-id';

export const isUserAdminOfGroup = (readModel: ReadModel) => (userId: UserId, groupId: GroupId): boolean => (
  readModel.byUserId[userId] !== undefined && readModel.byUserId[userId].includes(groupId)
);
