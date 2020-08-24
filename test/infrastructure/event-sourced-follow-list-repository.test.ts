import createEventSourcedFollowListRepository, { GetAllEvents } from '../../src/infrastructure/event-sourced-follow-list-repository';
import EditorialCommunityId from '../../src/types/editorial-community-id';
import FollowList from '../../src/types/follow-list';
import userId from '../../src/types/user-id';

describe('event-sourced-follow-list-repository', () => {
  it('builds a follow list from events', async () => {
    const editorialCommunitityId1 = new EditorialCommunityId('ed1');
    const userId1 = userId('u1');
    const getAllEvents: GetAllEvents = async () => [
      {
        type: 'UserFollowedEditorialCommunity',
        date: new Date(),
        userId: userId1,
        editorialCommunityId: editorialCommunitityId1,
      },
    ];
    const repository = createEventSourcedFollowListRepository(getAllEvents);

    const actual = await repository(userId1);
    const expected = new FollowList([editorialCommunitityId1]);

    expect(actual).toStrictEqual(expected);
  });

  it.todo('ignored communities that the user has unfollowed');

  it.todo('ignores communities that other users have followed');

  it.todo('ignores communities followed by the user that other users have unfollowed');
});
