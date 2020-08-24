import EditorialCommunityId from '../types/editorial-community-id';
import FollowList from '../types/follow-list';
import { UserId } from '../types/user-id';

export type Follows = (userId: UserId, editorialCommunityId: EditorialCommunityId) => Promise<boolean>;

type GetFollowList = (userId: UserId) => Promise<FollowList>;

export default (getFollowList: GetFollowList): Follows => (
  async (userId, editorialCommunityId) => (
    (await getFollowList(userId)).follows(editorialCommunityId)
  )
);
