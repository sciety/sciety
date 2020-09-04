import createGetFollowersFromIds, {
  GetFollowerIds,
  GetUserDetails,
} from '../../src/editorial-community-page/get-followers-from-ids';
import EditorialCommunityId from '../../src/types/editorial-community-id';
import toUserId from '../../src/types/user-id';

describe('get-followers-from-ids', () => {
  it('provides user details for a list of user ids', async () => {
    const getFollowerIds: GetFollowerIds = async () => [
      toUserId('11111111'),
    ];
    const getUserDetails: GetUserDetails = async () => ({
      handle: 'some_handle',
      displayName: 'Some User',
      avatarUrl: 'http://example.com',
    });
    const getFollowersFromIds = createGetFollowersFromIds(getFollowerIds, getUserDetails);
    const followers = await getFollowersFromIds(new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'));

    expect(followers).toHaveLength(1);
    expect(followers[0]).toStrictEqual({
      handle: 'some_handle',
      displayName: 'Some User',
      avatarUrl: 'http://example.com',
      userId: toUserId('11111111'),
    });
  });
});
