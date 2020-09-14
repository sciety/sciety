import createProjectIsFollowingSomething, { GetAllEvents } from '../../src/home-page/project-is-following-something';
import EditorialCommunityId from '../../src/types/editorial-community-id';
import { generate } from '../../src/types/event-id';
import userId from '../../src/types/user-id';

describe('project-is-following-something', () => {
  const getAllEvents: GetAllEvents = async () => [
    {
      id: generate(),
      type: 'UserFollowedEditorialCommunity',
      date: new Date(),
      userId: userId('someone'),
      editorialCommunityId: new EditorialCommunityId('316db7d9-88cc-4c26-b386-f067e0f56334'),
    },
    {
      id: generate(),
      type: 'UserFollowedEditorialCommunity',
      date: new Date(),
      userId: userId('someone'),
      editorialCommunityId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'),
    },
    {
      id: generate(),
      type: 'UserUnfollowedEditorialCommunity',
      date: new Date(),
      userId: userId('someone'),
      editorialCommunityId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'),
    },
    {
      id: generate(),
      type: 'UserFollowedEditorialCommunity',
      date: new Date(),
      userId: userId('someone'),
      editorialCommunityId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'),
    },
    {
      id: generate(),
      type: 'UserFollowedEditorialCommunity',
      date: new Date(),
      userId: userId('someone'),
      editorialCommunityId: new EditorialCommunityId('74fd66e9-3b90-4b5a-a4ab-5be83db4c5de'),
    },
    {
      type: 'EditorialCommunityJoined',
      date: new Date(),
      editorialCommunityId: new EditorialCommunityId('74fd66e9-3b90-4b5a-a4ab-5be83db4c5de'),
    },
    {
      id: generate(),
      type: 'UserFollowedEditorialCommunity',
      date: new Date(),
      userId: userId('someoneelse'),
      editorialCommunityId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    },
    {
      id: generate(),
      type: 'UserUnfollowedEditorialCommunity',
      date: new Date(),
      userId: userId('someoneelse'),
      editorialCommunityId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'),
    },
  ];

  it('returns a boolean', async () => {
    const isFollowingSomething = createProjectIsFollowingSomething(getAllEvents);

    const actual = await isFollowingSomething(userId('someone'));

    expect(actual).toBe(true);
  });

  describe('when there are no events', () => {
    it.todo('not following anything');
  });

  describe('when there is one follow event', () => {
    it.todo('is following something');
  });

  describe('when there is a follow event followed by unfollow event', () => {
    it.todo('not following anything');
  });

  describe('when another user has a follow event', () => {
    it.todo('not following anything');
  });

  describe('when a second community has both follow and unfollow events and the first has only follow event', () => {
    it.todo('is following something');
  });
});
