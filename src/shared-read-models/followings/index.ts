import { followingsStatus } from './followings-status';
import { getFollowers } from './get-followers';
import { getGroupsFollowedBy } from './get-groups-followed-by';
import { handleEvent, initialState } from './handle-event';
import { isFollowing } from './is-following';

export const followings = {
  queries: {
    followingsStatus,
    getFollowers,
    getGroupsFollowedBy,
    isFollowing,
  },
  initialState,
  handleEvent,
};
