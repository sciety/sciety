import * as T from 'fp-ts/Task';
import { GetAllEvents, projectIsFollowingSomething } from '../../src/home-page/project-is-following-something';
import { userFollowedEditorialCommunity, userUnfollowedEditorialCommunity } from '../../src/types/domain-events';
import { EditorialCommunityId } from '../../src/types/editorial-community-id';
import { toUserId } from '../../src/types/user-id';

describe('project-is-following-something', () => {
  describe('when there are no events', () => {
    const getAllEvents: GetAllEvents = T.of([]);

    it('not following anything', async () => {
      const isFollowingSomething = projectIsFollowingSomething(getAllEvents);
      const result = await isFollowingSomething(toUserId('someone'))();

      expect(result).toBe(false);
    });
  });

  describe('when there is one follow event', () => {
    const someone = toUserId('someone');
    const getAllEvents: GetAllEvents = T.of([
      userFollowedEditorialCommunity(someone, new EditorialCommunityId('dummy')),
    ]);

    it('is following something', async () => {
      const isFollowingSomething = projectIsFollowingSomething(getAllEvents);
      const result = await isFollowingSomething(someone)();

      expect(result).toBe(true);
    });
  });

  describe('when there is a follow event followed by unfollow event', () => {
    const someone = toUserId('someone');
    const getAllEvents: GetAllEvents = T.of([
      userFollowedEditorialCommunity(someone, new EditorialCommunityId('dummy')),
      userUnfollowedEditorialCommunity(someone, new EditorialCommunityId('dummy')),
    ]);

    it('not following anything', async () => {
      const isFollowingSomething = projectIsFollowingSomething(getAllEvents);
      const result = await isFollowingSomething(someone)();

      expect(result).toBe(false);
    });
  });

  describe('when another user has a follow event', () => {
    const someone = toUserId('someone');
    const someoneElse = toUserId('someoneelse');
    const getAllEvents: GetAllEvents = T.of([
      userFollowedEditorialCommunity(someoneElse, new EditorialCommunityId('dummy')),
    ]);

    it('not following anything', async () => {
      const isFollowingSomething = projectIsFollowingSomething(getAllEvents);
      const result = await isFollowingSomething(someone)();

      expect(result).toBe(false);
    });
  });

  describe('when a second community has both follow and unfollow events and the first has only follow event', () => {
    const someone = toUserId('someone');
    const editorialCommunity1 = new EditorialCommunityId('community-1');
    const editorialCommunity2 = new EditorialCommunityId('community-2');
    const getAllEvents: GetAllEvents = T.of([
      userFollowedEditorialCommunity(someone, editorialCommunity2),
      userFollowedEditorialCommunity(someone, editorialCommunity1),
      userUnfollowedEditorialCommunity(someone, editorialCommunity2),
    ]);

    it('is following something', async () => {
      const isFollowingSomething = projectIsFollowingSomething(getAllEvents);
      const result = await isFollowingSomething(someone)();

      expect(result).toBe(true);
    });
  });
});
