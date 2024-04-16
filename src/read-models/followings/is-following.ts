import { getGroupsFollowedBy } from './get-groups-followed-by';
import { ReadModel } from './handle-event';
import { GroupId } from '../../types/group-id';
import { UserId } from '../../types/user-id';

type IsFollowing = (groupId: GroupId) => (userId: UserId) => boolean;

export const isFollowing = (readmodel: ReadModel): IsFollowing => (groupId) => (userId) => (
  getGroupsFollowedBy(readmodel)(userId).includes(groupId)
);
