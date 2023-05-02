import { GroupId } from '../../types/group-id';
import { UserId } from '../../types/user-id';
import { ReadModel } from './handle-event';

export type GetGroupsFollowedBy = (userId: UserId) => ReadonlyArray<GroupId>;

export const getGroupsFollowedBy = (readmodel: ReadModel): GetGroupsFollowedBy => (userId) => (
  readmodel[userId] ?? []
);
