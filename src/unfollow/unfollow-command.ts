import * as T from 'fp-ts/Task';
import { UserUnfollowedEditorialCommunityEvent } from '../types/domain-events';
import { FollowList } from '../types/follow-list';
import { GroupId } from '../types/group-id';
import { User } from '../types/user';
import { UserId } from '../types/user-id';

export type CommitEvents = (events: ReadonlyArray<UserUnfollowedEditorialCommunityEvent>) => T.Task<void>;
export type GetFollowList = (userId: UserId) => Promise<FollowList>;

type UnfollowCommand = (user: User, editorialCommunityId: GroupId) => Promise<void>;

export const unfollowCommand = (
  getFollowList: GetFollowList,
  commitEvents: CommitEvents,
): UnfollowCommand => (
  async (user, editorialCommunityId) => {
    const followList = await getFollowList(user.id);
    const events = followList.unfollow(editorialCommunityId);
    await commitEvents(events)();
  }
);
