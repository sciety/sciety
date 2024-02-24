import { GroupId } from '../../types/group-id.js';
import { UserId } from '../../types/user-id.js';
import { ReadModel } from './handle-event.js';

type GetGroupsFollowedBy = (userId: UserId) => ReadonlyArray<GroupId>;

export const getGroupsFollowedBy = (readmodel: ReadModel): GetGroupsFollowedBy => (userId) => (
  readmodel[userId] ?? []
);
