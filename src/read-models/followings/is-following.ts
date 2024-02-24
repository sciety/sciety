import { ReadModel } from './handle-event.js';
import { getGroupsFollowedBy } from './get-groups-followed-by.js';
import { GroupId } from '../../types/group-id.js';
import { UserId } from '../../types/user-id.js';

type IsFollowing = (groupId: GroupId) => (userId: UserId) => boolean;

export const isFollowing = (readmodel: ReadModel): IsFollowing => (groupId) => (userId) => (
  getGroupsFollowedBy(readmodel)(userId).includes(groupId)
);
