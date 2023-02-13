import { ReadModel } from './handle-event';
import { getGroupsFollowedBy } from './get-groups-followed-by';
import { IsFollowing } from '../../shared-ports';

// ts-unused-exports:disable-next-line
export const isFollowing = (readmodel: ReadModel): IsFollowing => (groupId) => (userId) => (
  getGroupsFollowedBy(readmodel)(userId).includes(groupId)
);
