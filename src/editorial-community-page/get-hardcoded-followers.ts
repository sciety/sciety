import { GetFollowers } from './render-followers';
import toUserId, { UserId } from '../types/user-id';

export type GetUserDetails = (userId: UserId) => Promise<{
  handle: string;
}>;

export default (getUserDetails: GetUserDetails): GetFollowers => (
  async (editorialCommunityId) => {
    if (editorialCommunityId.value === 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0') {
      const userId = toUserId('47998559');
      return [{
        avatarUrl: ' https://pbs.twimg.com/profile_images/622704117635543040/DQRaHUah_normal.jpg',
        handle: (await getUserDetails(userId)).handle,
        displayName: 'Giorgio Sironi 🇮🇹🇬🇧🇪🇺',
        userId,
      }];
    }
    return [];
  }
);
