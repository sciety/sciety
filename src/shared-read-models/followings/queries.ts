import { GetFollowers, getFollowers } from './get-followers';
import { ReadModel } from './handle-event';
import { GetGroupsFollowedBy, getGroupsFollowedBy } from './get-groups-followed-by';
import { isFollowing, IsFollowing } from './is-following';

export type Queries = {
  getFollowers: GetFollowers,
  getGroupsFollowedBy: GetGroupsFollowedBy,
  isFollowing: IsFollowing,
};

export const queries = (instance: ReadModel): Queries => ({
  getFollowers: getFollowers(instance),
  getGroupsFollowedBy: getGroupsFollowedBy(instance),
  isFollowing: isFollowing(instance),
});
