import { GetFollowers } from './render-followers';
import EditorialCommunityId from '../types/editorial-community-id';
import { UserId } from '../types/user-id';

export type GetFollowerIds = (editorialCommunityId: EditorialCommunityId) => Promise<ReadonlyArray<UserId>>;

export type GetUserDetails = (userId: UserId) => Promise<{
  handle: string;
  displayName: string;
  avatarUrl: string;
}>;

export default (getFollowerIds: GetFollowerIds, getUserDetails: GetUserDetails): GetFollowers => (
  async (editorialCommunityId) => {
    const userIds = await getFollowerIds(editorialCommunityId);
    return Promise.all(userIds.map(async (userId) => {
      const userDetails = await getUserDetails(userId);
      return {
        ...userDetails,
        userId,
      };
    }));
  }
);
