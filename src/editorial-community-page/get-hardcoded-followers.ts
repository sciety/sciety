import { GetFollowers } from './render-followers';
import toUserId, { UserId } from '../types/user-id';

export type GetUserDetails = (userId: UserId) => Promise<{
  handle: string;
  displayName: string;
  avatarUrl: string;
}>;

export default (getUserDetails: GetUserDetails): GetFollowers => (
  async (editorialCommunityId) => {
    const userIds = [];
    if (editorialCommunityId.value === 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0') {
      userIds.push(toUserId('47998559'));
      userIds.push(toUserId('23776533'));
    }
    return Promise.all(userIds.map(async (userId) => {
      const userDetails = await getUserDetails(userId);
      return {
        ...userDetails,
        userId,
      };
    }));
  }
);
