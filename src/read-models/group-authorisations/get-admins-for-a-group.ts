import { ReadModel } from './handle-event';
import { GroupId } from '../../types/group-id';
import { UserId } from '../../types/user-id';

export const getAdminsForAGroup = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  readModel: ReadModel,
) => (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  groupId: GroupId,
): ReadonlyArray<UserId> => (
  []
);
