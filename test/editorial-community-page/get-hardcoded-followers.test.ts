import createGetHardcodedFollowers, { GetUserDetails } from '../../src/editorial-community-page/get-hardcoded-followers';
import EditorialCommunityId from '../../src/types/editorial-community-id';

describe('get-hardcoded-followers', () => {
  it('provides user details for a fixed list of user ids', async () => {
    const getUserDetails: GetUserDetails = async () => ({
      handle: 'some_handle',
      displayName: 'Some User',
      avatarUrl: 'http://example.com',
    });
    const getHardcodedFollowers = createGetHardcodedFollowers(getUserDetails);
    const followers = await getHardcodedFollowers(new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'));

    expect(followers).toHaveLength(1);
    expect(followers[0]).toMatchObject({
      handle: 'some_handle',
      displayName: 'Some User',
      avatarUrl: 'http://example.com',
    });
  });
});
