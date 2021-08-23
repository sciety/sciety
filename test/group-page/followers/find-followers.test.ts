import { userFollowedEditorialCommunity, userUnfollowedEditorialCommunity } from '../../../src/domain-events';
import { findFollowers } from '../../../src/group-page/followers/find-followers';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

describe('find-followers', () => {
  describe('when no users have followed the group', () => {
    it('return empty list', () => {
      const result = findFollowers(arbitraryGroupId())([]);

      expect(result).toStrictEqual([]);
    });
  });

  describe('when 1 user has followed the group', () => {
    const userId = arbitraryUserId();
    const groupId = arbitraryGroupId();
    const events = [
      userFollowedEditorialCommunity(userId, groupId),
    ];
    const result = findFollowers(groupId)(events);

    it('returns a list containing them as a follower', () => {
      expect(result).toStrictEqual([
        expect.objectContaining({
          userId,
        }),
      ]);
    });

    it('their followedGroupCount is 1', () => {
      expect(result).toStrictEqual([
        expect.objectContaining({
          followedGroupCount: 1,
        }),
      ]);
    });

    it('their listCount is 1', () => {
      expect(result).toStrictEqual([
        expect.objectContaining({
          listCount: 1,
        }),
      ]);
    });
  });

  describe('when 1 user has followed then unfollowed the group', () => {
    it('return empty list', () => {
      const userId = arbitraryUserId();
      const groupId = arbitraryGroupId();
      const events = [
        userFollowedEditorialCommunity(userId, groupId),
        userUnfollowedEditorialCommunity(userId, groupId),
      ];
      const result = findFollowers(groupId)(events);

      expect(result).toStrictEqual([]);
    });
  });

  describe('when 1 user has followed the group and another group', () => {
    const userId = arbitraryUserId();
    const groupId = arbitraryGroupId();

    it('returns a list containing them as a follower', () => {
      const events = [
        userFollowedEditorialCommunity(userId, groupId),
        userFollowedEditorialCommunity(userId, arbitraryGroupId()),
      ];
      const result = findFollowers(groupId)(events);

      expect(result).toStrictEqual([expect.objectContaining({ userId })]);
    });

    it('their followedGroupCount is 2', () => {
      const events = [
        userFollowedEditorialCommunity(userId, groupId),
        userFollowedEditorialCommunity(userId, arbitraryGroupId()),
      ];
      const result = findFollowers(groupId)(events);

      expect(result).toStrictEqual([expect.objectContaining({ followedGroupCount: 2 })]);
    });

    describe('and then unfollowed the other group', () => {
      it.skip('their followedGroupCount is 1', () => {
        const otherGroupId = arbitraryGroupId();
        const events = [
          userFollowedEditorialCommunity(userId, groupId),
          userFollowedEditorialCommunity(userId, otherGroupId),
          userUnfollowedEditorialCommunity(userId, otherGroupId),
        ];
        const result = findFollowers(groupId)(events);

        expect(result).toStrictEqual([expect.objectContaining({ followedGroupCount: 1 })]);
      });
    });
  });

  describe('when multiple users have followed the group', () => {
    const leastRecentFollowingUserId = arbitraryUserId();
    const mostRecentFollowingUserId = arbitraryUserId();
    const groupId = arbitraryGroupId();
    const events = [
      userFollowedEditorialCommunity(leastRecentFollowingUserId, groupId),
      userFollowedEditorialCommunity(mostRecentFollowingUserId, groupId),
    ];
    const result = findFollowers(groupId)(events);

    it('returns a list containing them as followers', () => {
      expect(result).toStrictEqual(expect.arrayContaining([
        expect.objectContaining({
          userId: leastRecentFollowingUserId,
        }),
        expect.objectContaining({
          userId: mostRecentFollowingUserId,
        }),
      ]));
    });

    it('the list is ordered with most recently followed first', () => {
      expect(result).toStrictEqual([
        expect.objectContaining({
          userId: mostRecentFollowingUserId,
        }),
        expect.objectContaining({
          userId: leastRecentFollowingUserId,
        }),
      ]);
    });
  });
});
