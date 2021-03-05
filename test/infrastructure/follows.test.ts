import * as T from 'fp-ts/Task';
import { follows } from '../../src/infrastructure/follows';
import { userFollowedEditorialCommunity, userUnfollowedEditorialCommunity } from '../../src/types/domain-events';
import { GroupId } from '../../src/types/group-id';
import { toUserId } from '../../src/types/user-id';

describe('follows', () => {
  const someone = toUserId('someone');
  const editorialCommunity1 = new GroupId('community-1');
  const editorialCommunity2 = new GroupId('community-2');

  describe('when there are no events', () => {
    const getAllEvents = T.of([]);

    it('is not following the community', async () => {
      const result = await follows(someone, new GroupId('community-1'))(getAllEvents)();

      expect(result).toBe(false);
    });
  });

  describe('when there is one follow event', () => {
    const getAllEvents = T.of([
      userFollowedEditorialCommunity(someone, editorialCommunity1),
    ]);

    it('is following the community', async () => {
      const result = await follows(someone, new GroupId('community-1'))(getAllEvents)();

      expect(result).toBe(true);
    });
  });

  describe('when there is a follow event followed by unfollow event', () => {
    const getAllEvents = T.of([
      userFollowedEditorialCommunity(someone, editorialCommunity1),
      userUnfollowedEditorialCommunity(someone, editorialCommunity1),
    ]);

    it('not following the community', async () => {
      const result = await follows(someone, new GroupId('community-1'))(getAllEvents)();

      expect(result).toBe(false);
    });
  });

  describe('when another user has a follow event', () => {
    const someoneElse = toUserId('someoneelse');
    const getAllEvents = T.of([
      userFollowedEditorialCommunity(someoneElse, editorialCommunity1),
    ]);

    it('not following the community', async () => {
      const result = await follows(someone, new GroupId('community-1'))(getAllEvents)();

      expect(result).toBe(false);
    });
  });

  describe('when a second community has both follow and unfollow events and the first has only follow event', () => {
    const getAllEvents = T.of([
      userFollowedEditorialCommunity(someone, editorialCommunity2),
      userFollowedEditorialCommunity(someone, editorialCommunity1),
      userUnfollowedEditorialCommunity(someone, editorialCommunity2),
    ]);

    it('is following the community', async () => {
      const result = await follows(someone, new GroupId('community-1'))(getAllEvents)();

      expect(result).toBe(true);
    });
  });
});
