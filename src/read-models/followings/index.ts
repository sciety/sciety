import { followingsStatus } from './followings-status.js';
import { getFollowers } from './get-followers.js';
import { getGroupsFollowedBy } from './get-groups-followed-by.js';
import { handleEvent, initialState } from './handle-event.js';
import { isFollowing } from './is-following.js';

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
