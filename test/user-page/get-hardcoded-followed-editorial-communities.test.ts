import userId from '../../src/types/user-id';
import createGetHardcodedFollowedEditorialCommunities, { GetEditorialCommunity } from '../../src/user-page/get-hardcoded-followed-editorial-communities';

describe('get-hardcoded-followed-editorial-communities adapter', () => {
  it('provides a list of communities', async () => {
    const getEditorialCommunity: GetEditorialCommunity = async () => ({
      name: 'Name',
      avatarUrl: 'http://example.com/avatar.png',
    });
    const adapter = createGetHardcodedFollowedEditorialCommunities(getEditorialCommunity);
    const editorialCommunities = await adapter(userId('someone'));

    expect(editorialCommunities).toHaveLength(3);
  });
});
