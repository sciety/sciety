import userId from '../../src/types/user-id';
import createProjectFollowedEditorialCommunityIds from '../../src/user-page/project-followed-editorial-community-ids';

describe('project-followed-editorial-community-ids', () => {
  it('returns a list', async () => {
    const projectFollowedEditorialCommunityIds = createProjectFollowedEditorialCommunityIds();

    const list = await projectFollowedEditorialCommunityIds(userId('someone'));

    expect(list).toHaveLength(3);
  });
});
