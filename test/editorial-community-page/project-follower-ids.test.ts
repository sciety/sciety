import createProjectFollowerIds from '../../src/editorial-community-page/project-follower-ids';
import EditorialCommunityId from '../../src/types/editorial-community-id';

describe('project-follower-ids', () => {
  it('projects a list of follower ids based on hardcoded follow events', async () => {
    const projectFollowerIds = createProjectFollowerIds();

    const followerIds = await projectFollowerIds(new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'));

    expect(followerIds).toHaveLength(2);
  });
});
