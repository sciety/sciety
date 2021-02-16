import * as T from 'fp-ts/Task';
import { editorialCommunityJoined, userFollowedEditorialCommunity, userUnfollowedEditorialCommunity } from '../../src/types/domain-events';
import { EditorialCommunityId } from '../../src/types/editorial-community-id';
import { toUserId } from '../../src/types/user-id';
import { GetAllEvents, projectFollowedEditorialCommunityIds } from '../../src/user-page/project-followed-editorial-community-ids';

describe('project-followed-editorial-community-ids', () => {
  const getAllEvents: GetAllEvents = T.of([
    userFollowedEditorialCommunity(toUserId('someone'), new EditorialCommunityId('316db7d9-88cc-4c26-b386-f067e0f56334')),
    userFollowedEditorialCommunity(toUserId('someone'), new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002')),
    userUnfollowedEditorialCommunity(toUserId('someone'), new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002')),
    userFollowedEditorialCommunity(toUserId('someone'), new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002')),
    userFollowedEditorialCommunity(toUserId('someone'), new EditorialCommunityId('74fd66e9-3b90-4b5a-a4ab-5be83db4c5de')),
    editorialCommunityJoined(new EditorialCommunityId('74fd66e9-3b90-4b5a-a4ab-5be83db4c5de')),
    userFollowedEditorialCommunity(toUserId('someoneelse'), new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0')),
    userUnfollowedEditorialCommunity(toUserId('someoneelse'), new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002')),
  ]);

  it('returns a list', async () => {
    const actual = await projectFollowedEditorialCommunityIds(getAllEvents)(toUserId('someone'))();
    const expected = [
      new EditorialCommunityId('316db7d9-88cc-4c26-b386-f067e0f56334'),
      new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'),
      new EditorialCommunityId('74fd66e9-3b90-4b5a-a4ab-5be83db4c5de'),
    ];

    expect(actual).toStrictEqual(expected);
  });
});
