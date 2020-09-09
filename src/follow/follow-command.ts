import { UserFollowedEditorialCommunityEvent } from '../types/domain-events';
import EditorialCommunityId from '../types/editorial-community-id';
import FollowList from '../types/follow-list';
import { User } from '../types/user';
import { UserId } from '../types/user-id';

export type CommitEvents = (events: ReadonlyArray<UserFollowedEditorialCommunityEvent>) => Promise<void>;
export type GetFollowList = (userId: UserId) => Promise<FollowList>;

interface Ports {
  commitEvents: CommitEvents;
  getFollowList: GetFollowList;
}

type FollowCommand = (user: User, editorialCommunityId: EditorialCommunityId) => Promise<void>;

export default (
  getFollowList: GetFollowList,
  commitEvents: CommitEvents,
): FollowCommand => (
  async (user, editorialCommunityId) => {
    const followList = await getFollowList(user.id);
    const events = followList.follow(editorialCommunityId);
    await commitEvents(events);
  }
);
