import { ReadModel } from './handle-event';
import { GroupId } from '../../types/group-id';
import { UserId } from '../../types/user-id';
import { getGroupsFollowedBy } from './get-groups-followed-by';

type IsFollowing = (groupId: GroupId) => (userId: UserId) => boolean;

// ts-unused-exports:disable-next-line
export const isFollowing = (readmodel: ReadModel): IsFollowing => (groupId) => (userId) => (
  getGroupsFollowedBy(readmodel)(userId).includes(groupId)
);
