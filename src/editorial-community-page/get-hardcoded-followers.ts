import { GetFollowers } from './render-followers';
import toUserId from '../types/user-id';

export default (): GetFollowers => (
  async (editorialCommunityId) => {
    if (editorialCommunityId.value === 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0') {
      return [{
        avatarUrl: ' https://pbs.twimg.com/profile_images/622704117635543040/DQRaHUah_normal.jpg',
        handle: 'giorgiosironi',
        displayName: 'Giorgio Sironi 🇮🇹🇬🇧🇪🇺',
        userId: toUserId('47998559'),
      }];
    }
    return [];
  }
);
