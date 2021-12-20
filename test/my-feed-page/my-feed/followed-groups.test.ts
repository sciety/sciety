import { pipe } from 'fp-ts/function';
import { userFollowedEditorialCommunity, userUnfollowedEditorialCommunity } from '../../../src/domain-events';
import { followedGroups } from '../../../src/my-feed-page/my-feed/followed-groups';
import { arbitraryGroupId, groupIdFromString } from '../../types/group-id.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

describe('followed-groups', () => {
  const userId = arbitraryUserId();

  describe('there are no follow events', () => {
    const groupIds = pipe(
      [],
      followedGroups(userId),
    );

    it('returns an empty array', () => {
      expect(groupIds).toStrictEqual([]);
    });
  });

  describe('there is a single follow event for the user', () => {
    const groupId = arbitraryGroupId();
    const groupIds = pipe(
      [userFollowedEditorialCommunity(userId, groupId)],
      followedGroups(userId),
    );

    it('returns the group id', () => {
      expect(groupIds).toStrictEqual([groupId]);
    });
  });

  describe('there is a single follow event and a single unfollow event for the user', () => {
    const groupId = groupIdFromString('group');
    const sameGroupId = groupIdFromString('group');
    const groupIds = pipe(
      [
        userFollowedEditorialCommunity(userId, groupId),
        userUnfollowedEditorialCommunity(userId, sameGroupId),
      ],
      followedGroups(userId),
    );

    it('returns an empty array', () => {
      expect(groupIds).toStrictEqual([]);
    });
  });

  describe('there are 2 follow events for different groups for the user', () => {
    const groupId1 = arbitraryGroupId();
    const groupId2 = arbitraryGroupId();
    const groupIds = pipe(
      [
        userFollowedEditorialCommunity(userId, groupId1),
        userFollowedEditorialCommunity(userId, groupId2),
      ],
      followedGroups(userId),
    );

    it('returns the group ids', () => {
      expect(groupIds).toStrictEqual([groupId1, groupId2]);
    });
  });

  describe('there are 2 follow events and 1 unfollow events for the user', () => {
    const groupId1 = arbitraryGroupId();
    const groupId2 = arbitraryGroupId();
    const groupIds = pipe(
      [
        userFollowedEditorialCommunity(userId, groupId1),
        userFollowedEditorialCommunity(userId, groupId2),
        userUnfollowedEditorialCommunity(userId, groupId1),
      ],
      followedGroups(userId),
    );

    it('returns the group ids of the still followed group', () => {
      expect(groupIds).toStrictEqual([groupId2]);
    });
  });

  describe('there is only a follow event for another user', () => {
    const groupId = arbitraryGroupId();
    const groupIds = pipe(
      [
        userFollowedEditorialCommunity(arbitraryUserId(), groupId),
      ],
      followedGroups(userId),
    );

    it('returns an empty array', () => {
      expect(groupIds).toStrictEqual([]);
    });
  });

  describe('there is a single follow event for the user, and a follow and unfollow event for another user', () => {
    const groupId = arbitraryGroupId();
    const otherUserId = arbitraryUserId();
    const groupIds = pipe(
      [
        userFollowedEditorialCommunity(userId, groupId),
        userFollowedEditorialCommunity(otherUserId, groupId),
        userUnfollowedEditorialCommunity(otherUserId, groupId),
      ],
      followedGroups(userId),
    );

    it('returns an empty array', () => {
      expect(groupIds).toStrictEqual([groupId]);
    });
  });
});
