import { pipe } from 'fp-ts/function';
import { userFollowedEditorialCommunity, userUnfollowedEditorialCommunity } from '../../../src/domain-events';
import { getUsersFollowing } from '../../../src/shared-read-models/followings';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

describe('get-users-following', () => {
  const userId = arbitraryUserId();
  const groupId = arbitraryGroupId();

  describe('when no users have followed the group', () => {
    const result = pipe(
      [],
      getUsersFollowing(arbitraryGroupId()),
    );

    it('return empty list', () => {
      expect(result).toStrictEqual([]);
    });
  });

  describe('when 1 user has followed the group', () => {
    const result = pipe(
      [
        userFollowedEditorialCommunity(userId, groupId),
      ],
      getUsersFollowing(groupId),
    );

    it('returns a list containing them as a follower', () => {
      expect(result).toStrictEqual([userId]);
    });
  });

  describe('when 1 user has followed then unfollowed the group', () => {
    const result = pipe(
      [
        userFollowedEditorialCommunity(userId, groupId),
        userUnfollowedEditorialCommunity(userId, groupId),
      ],
      getUsersFollowing(groupId),
    );

    it('returns empty list', () => {
      expect(result).toStrictEqual([]);
    });
  });

  describe('when 1 user has followed the group and another group', () => {
    const result = pipe(
      [
        userFollowedEditorialCommunity(userId, groupId),
        userFollowedEditorialCommunity(userId, arbitraryGroupId()),
      ],
      getUsersFollowing(groupId),
    );

    it('returns a list containing them as a follower', () => {
      expect(result).toStrictEqual([userId]);
    });
  });

  describe('when multiple users have followed the group', () => {
    const userId2 = arbitraryUserId();
    const result = pipe(
      [
        userFollowedEditorialCommunity(userId, groupId),
        userFollowedEditorialCommunity(userId2, groupId),
      ],
      getUsersFollowing(groupId),
    );

    it('returns a list containing them as followers', () => {
      expect(result).toStrictEqual(expect.arrayContaining([
        userId,
        userId2,
      ]));
    });
  });
});
