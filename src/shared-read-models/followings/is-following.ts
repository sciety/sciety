import { ReadModel } from './handle-event';
import { getGroupsFollowedBy } from './get-groups-followed-by';
import { IsFollowing } from '../../shared-ports';

export const isFollowing = (readmodel: ReadModel): IsFollowing => (groupId) => (userId) => (
  getGroupsFollowedBy(readmodel)(userId).includes(groupId)
);
