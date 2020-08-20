import userId from '../../src/types/user-id';
import createGetHardcodedFollowedEditorialCommunities from '../../src/user-page/get-hardcoded-followed-editorial-communities';

describe('get-hardcoded-followed-editorial-communities adapter', () => {
  it('provides a list of communities', async () => {
    const adapter = createGetHardcodedFollowedEditorialCommunities();
    const editorialCommunities = await adapter(userId('someone'));

    expect(editorialCommunities).toHaveLength(3);
  });
});
