import { UserId } from '../types/user-id';

export type GetTwitterUserDetails = (userId: UserId) => Promise<{
  avatarUrl: string,
}>;

export default (): GetTwitterUserDetails => (
  async () => ({
    avatarUrl: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_bigger.png',
  })
);
