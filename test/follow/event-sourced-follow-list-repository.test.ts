import { userFollowedEditorialCommunity, userUnfollowedEditorialCommunity } from '../../src/domain-events';
import { createEventSourceFollowListRepository } from '../../src/follow/event-sourced-follow-list-repository';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryUserId } from '../types/user-id.helper';

const groupId1 = arbitraryGroupId();
const groupId2 = arbitraryGroupId();
const userId1 = arbitraryUserId();
const userId2 = arbitraryUserId();

describe('event-sourced-follow-list-repository', () => {
  it('builds a follow list from events', () => {
    const events = [
      userFollowedEditorialCommunity(userId1, groupId1),
    ];
    const actual = createEventSourceFollowListRepository(userId1)(events);

    expect(actual).toStrictEqual([groupId1]);
  });

  it('ignores groups that the user has unfollowed', () => {
    const events = [
      userFollowedEditorialCommunity(userId1, groupId1),
      userUnfollowedEditorialCommunity(userId1, groupId1),
    ];
    const actual = createEventSourceFollowListRepository(userId1)(events);

    expect(actual).toHaveLength(0);
  });

  it('ignores groups that other users have followed', () => {
    const events = [
      userFollowedEditorialCommunity(userId1, groupId1),
      userFollowedEditorialCommunity(userId2, groupId2),
    ];
    const actual = createEventSourceFollowListRepository(userId1)(events);

    expect(actual).toStrictEqual([groupId1]);
  });

  it('ignores groups followed by the user that other users have unfollowed', () => {
    const events = [
      userFollowedEditorialCommunity(userId1, groupId1),
      userUnfollowedEditorialCommunity(userId2, groupId1),
    ];
    const actual = createEventSourceFollowListRepository(userId1)(events);

    expect(actual).toStrictEqual([groupId1]);
  });
});
