import * as T from 'fp-ts/Task';
import { Doi } from '../../src/types/doi';
import { userFollowedEditorialCommunity, userSavedArticle, userUnfollowedEditorialCommunity } from '../../src/types/domain-events';
import { GroupId } from '../../src/types/group-id';
import { toUserId } from '../../src/types/user-id';
import { GetAllEvents, projectFollowedGroupIds } from '../../src/user-page/project-followed-group-ids';

describe('project-followed-group-ids', () => {
  const getAllEvents: GetAllEvents = T.of([
    userFollowedEditorialCommunity(toUserId('someone'), new GroupId('316db7d9-88cc-4c26-b386-f067e0f56334')),
    userFollowedEditorialCommunity(toUserId('someone'), new GroupId('53ed5364-a016-11ea-bb37-0242ac130002')),
    userUnfollowedEditorialCommunity(toUserId('someone'), new GroupId('53ed5364-a016-11ea-bb37-0242ac130002')),
    userFollowedEditorialCommunity(toUserId('someone'), new GroupId('53ed5364-a016-11ea-bb37-0242ac130002')),
    userFollowedEditorialCommunity(toUserId('someone'), new GroupId('74fd66e9-3b90-4b5a-a4ab-5be83db4c5de')),
    userSavedArticle(toUserId('someone'), new Doi('10.1101/111111')),
    userFollowedEditorialCommunity(toUserId('someoneelse'), new GroupId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0')),
    userUnfollowedEditorialCommunity(toUserId('someoneelse'), new GroupId('53ed5364-a016-11ea-bb37-0242ac130002')),
  ]);

  it('returns a list', async () => {
    const actual = await projectFollowedGroupIds(getAllEvents)(toUserId('someone'))();
    const expected = [
      new GroupId('316db7d9-88cc-4c26-b386-f067e0f56334'),
      new GroupId('53ed5364-a016-11ea-bb37-0242ac130002'),
      new GroupId('74fd66e9-3b90-4b5a-a4ab-5be83db4c5de'),
    ];

    expect(actual).toStrictEqual(expected);
  });

  describe('when a group is followed', () => {
    const group1 = new GroupId('group-1');

    it('lists that group', async () => {
      const followed = await projectFollowedGroupIds(T.of([
        userFollowedEditorialCommunity(toUserId('someone'), group1),
      ]))(toUserId('someone'))();

      expect(followed).toStrictEqual([group1]);
    });
  });

  describe('when a group is unfollowed', () => {
    const group1 = new GroupId('group-1');

    it('does not list that group', async () => {
      const followed = await projectFollowedGroupIds(T.of([
        userFollowedEditorialCommunity(toUserId('someone'), group1),
        userUnfollowedEditorialCommunity(toUserId('someone'), group1),
      ]))(toUserId('someone'))();

      expect(followed).toStrictEqual([]);
    });
  });
});
