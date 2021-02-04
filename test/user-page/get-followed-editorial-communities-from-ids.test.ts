import * as T from 'fp-ts/Task';
import { EditorialCommunityId } from '../../src/types/editorial-community-id';
import { toUserId } from '../../src/types/user-id';
import { createGetFollowedEditorialCommunitiesFromIds, GetEditorialCommunity, GetFollowedEditorialCommunityIds } from '../../src/user-page/get-followed-editorial-communities-from-ids';

describe('get-followed-editorial-communities-from-ids adapter', () => {
  it('provides a list of communities', async () => {
    const getFollowedEditorialCommunityIds: GetFollowedEditorialCommunityIds = () => (
      T.of<ReadonlyArray<EditorialCommunityId>>([
        new EditorialCommunityId('316db7d9-88cc-4c26-b386-f067e0f56334'),
        new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'),
        new EditorialCommunityId('74fd66e9-3b90-4b5a-a4ab-5be83db4c5de'),
      ])
    );
    const getEditorialCommunity: GetEditorialCommunity = () => T.of({
      id: new EditorialCommunityId('my-community'),
      name: 'Name',
      avatarPath: '/avatar.png',
    });
    const adapter = createGetFollowedEditorialCommunitiesFromIds(
      getFollowedEditorialCommunityIds,
      getEditorialCommunity,
    );
    const editorialCommunities = await adapter(toUserId('someone'))();

    expect(editorialCommunities).toHaveLength(3);
  });
});
