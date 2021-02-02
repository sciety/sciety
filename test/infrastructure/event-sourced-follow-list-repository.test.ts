import * as T from 'fp-ts/Task';
import { createEventSourceFollowListRepository, GetAllEvents } from '../../src/infrastructure/event-sourced-follow-list-repository';
import { userFollowedEditorialCommunity, userUnfollowedEditorialCommunity } from '../../src/types/domain-events';
import { EditorialCommunityId } from '../../src/types/editorial-community-id';
import { FollowList } from '../../src/types/follow-list';
import { toUserId } from '../../src/types/user-id';

const editorialCommunityId1 = new EditorialCommunityId('ed1');
const editorialCommunityId2 = new EditorialCommunityId('ed2');
const userId1 = toUserId('u1');
const userId2 = toUserId('u2');

describe('event-sourced-follow-list-repository', () => {
  it('builds a follow list from events', async () => {
    const getAllEvents: GetAllEvents = T.of([
      userFollowedEditorialCommunity(userId1, editorialCommunityId1),
    ]);
    const repository = createEventSourceFollowListRepository(getAllEvents);

    const actual = await repository(userId1);
    const expected = new FollowList(userId1, [editorialCommunityId1.value]);

    expect(actual).toStrictEqual(expected);
  });

  it('ignored communities that the user has unfollowed', async () => {
    const getAllEvents: GetAllEvents = T.of([
      userFollowedEditorialCommunity(userId1, editorialCommunityId1),
      userUnfollowedEditorialCommunity(userId1, editorialCommunityId1),
    ]);
    const repository = createEventSourceFollowListRepository(getAllEvents);

    const actual = await repository(userId1);
    const expected = new FollowList(userId1, []);

    expect(actual).toStrictEqual(expected);
  });

  it('ignores communities that other users have followed', async () => {
    const getAllEvents: GetAllEvents = T.of([
      userFollowedEditorialCommunity(userId1, editorialCommunityId1),
      userFollowedEditorialCommunity(userId2, editorialCommunityId2),
    ]);
    const repository = createEventSourceFollowListRepository(getAllEvents);

    const actual = await repository(userId1);
    const expected = new FollowList(userId1, [editorialCommunityId1.value]);

    expect(actual).toStrictEqual(expected);
  });

  it('ignores communities followed by the user that other users have unfollowed', async () => {
    const getAllEvents: GetAllEvents = T.of([
      userFollowedEditorialCommunity(userId1, editorialCommunityId1),
      userUnfollowedEditorialCommunity(userId2, editorialCommunityId1),
    ]);
    const repository = createEventSourceFollowListRepository(getAllEvents);

    const actual = await repository(userId1);
    const expected = new FollowList(userId1, [editorialCommunityId1.value]);

    expect(actual).toStrictEqual(expected);
  });
});
