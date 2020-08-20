import EditorialCommunityId from '../../src/types/editorial-community-id';
import userId from '../../src/types/user-id';
import createProjectFollowedEditorialCommunityIds from '../../src/user-page/project-followed-editorial-community-ids';

describe('project-followed-editorial-community-ids', () => {
  it('returns a list', async () => {
    const projectFollowedEditorialCommunityIds = createProjectFollowedEditorialCommunityIds();

    const actual = await projectFollowedEditorialCommunityIds(userId('someone'));
    const expected = [
      new EditorialCommunityId('316db7d9-88cc-4c26-b386-f067e0f56334'),
      new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'),
      new EditorialCommunityId('74fd66e9-3b90-4b5a-a4ab-5be83db4c5de'),
    ];

    expect(actual).toStrictEqual(expected);
  });
});
