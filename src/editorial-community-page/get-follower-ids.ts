import EditorialCommunityId from '../types/editorial-community-id';
import toUserId, { UserId } from '../types/user-id';

type GetFollowerIds = (editorialCommunityId: EditorialCommunityId) => Promise<ReadonlyArray<UserId>>;

export default (): GetFollowerIds => (
  async (editorialCommunityId) => {
    const userIds = [];
    if (editorialCommunityId.value === 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0') {
      userIds.push(toUserId('47998559'));
      userIds.push(toUserId('23776533'));
    }
    return userIds;
  }
);
