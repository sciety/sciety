import { GetFollowers } from './render-followers';
import toUserId, { UserId } from '../types/user-id';

export type GetUserDetails = (userId: UserId) => Promise<{
  handle: string;
  displayName: string;
  avatarUrl: string;
}>;

export default (getUserDetails: GetUserDetails): GetFollowers => (
  async (editorialCommunityId) => {
    if (editorialCommunityId.value === 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0') {
      const userId = toUserId('47998559');
      const userDetails = await getUserDetails(userId);
      return [{
        ...userDetails,
        userId,
      }];
    }
    return [];
  }
);
