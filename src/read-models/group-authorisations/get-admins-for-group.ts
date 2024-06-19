import { ReadModel } from './handle-event';
import { GroupId } from '../../types/group-id';
import { UserId } from '../../types/user-id';

export const getAdminsForGroup = (
  readModel: ReadModel,
) => (
  groupId: GroupId,
): ReadonlyArray<UserId> => {
  const userIds = readModel.byGroupId.get(groupId);
  return userIds ?? [];
};
