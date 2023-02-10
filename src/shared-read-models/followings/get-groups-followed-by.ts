import { ReadModel } from './handle-event';
import { GroupId } from '../../types/group-id';
import { UserId } from '../../types/user-id';

type GetGroupsFollowedBy = (userId: UserId) => ReadonlyArray<GroupId>;

// ts-unused-exports:disable-next-line
export const getGroupsFollowedBy = (readmodel: ReadModel): GetGroupsFollowedBy => (userId) => (
  readmodel[userId] ?? []
);
