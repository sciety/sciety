import createProjectIsFollowingSomething, { GetAllEvents } from '../../src/home-page/project-is-following-something';
import EditorialCommunityId from '../../src/types/editorial-community-id';
import { generate } from '../../src/types/event-id';
import userId from '../../src/types/user-id';

describe('project-is-following-something', () => {
  describe('when there are no events', () => {
    const getAllEvents: GetAllEvents = async () => [];

    it('not following anything', async () => {
      const isFollowingSomething = createProjectIsFollowingSomething(getAllEvents);

      const result = await isFollowingSomething(userId('someone'));

      expect(result).toBe(false);
    });
  });

  describe('when there is one follow event', () => {
    const someone = userId('someone');
    const getAllEvents: GetAllEvents = async () => [
      {
        id: generate(),
        type: 'UserFollowedEditorialCommunity',
        date: new Date(),
        userId: someone,
        editorialCommunityId: new EditorialCommunityId('dummy'),
      },
    ];

    it('is following something', async () => {
      const isFollowingSomething = createProjectIsFollowingSomething(getAllEvents);

      const result = await isFollowingSomething(someone);

      expect(result).toBe(true);
    });
  });

  describe('when there is a follow event followed by unfollow event', () => {
    const someone = userId('someone');
    const getAllEvents: GetAllEvents = async () => [
      {
        id: generate(),
        type: 'UserFollowedEditorialCommunity',
        date: new Date(),
        userId: someone,
        editorialCommunityId: new EditorialCommunityId('dummy'),
      },
      {
        id: generate(),
        type: 'UserUnfollowedEditorialCommunity',
        date: new Date(),
        userId: someone,
        editorialCommunityId: new EditorialCommunityId('dummy'),
      },
    ];

    it('not following anything', async () => {
      const isFollowingSomething = createProjectIsFollowingSomething(getAllEvents);

      const result = await isFollowingSomething(someone);

      expect(result).toBe(false);
    });
  });

  describe('when another user has a follow event', () => {
    const someone = userId('someone');
    const someoneElse = userId('someoneelse');
    const getAllEvents: GetAllEvents = async () => [
      {
        id: generate(),
        type: 'UserFollowedEditorialCommunity',
        date: new Date(),
        userId: someoneElse,
        editorialCommunityId: new EditorialCommunityId('dummy'),
      },
    ];

    it('not following anything', async () => {
      const isFollowingSomething = createProjectIsFollowingSomething(getAllEvents);

      const result = await isFollowingSomething(someone);

      expect(result).toBe(false);
    });
  });

  describe('when a second community has both follow and unfollow events and the first has only follow event', () => {
    const someone = userId('someone');
    const editorialCommunity1 = new EditorialCommunityId('community-1');
    const editorialCommunity2 = new EditorialCommunityId('community-2');
    const getAllEvents: GetAllEvents = async () => [
      {
        id: generate(),
        type: 'UserFollowedEditorialCommunity',
        date: new Date(),
        userId: someone,
        editorialCommunityId: editorialCommunity1,
      },
      {
        id: generate(),
        type: 'UserUnfollowedEditorialCommunity',
        date: new Date(),
        userId: someone,
        editorialCommunityId: editorialCommunity1,
      },
      {
        id: generate(),
        type: 'UserFollowedEditorialCommunity',
        date: new Date(),
        userId: someone,
        editorialCommunityId: editorialCommunity2,
      },
    ];

    it('is following something', async () => {
      const isFollowingSomething = createProjectIsFollowingSomething(getAllEvents);

      const result = await isFollowingSomething(someone);

      expect(result).toBe(true);
    });
  });
});
