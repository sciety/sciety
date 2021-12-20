import { pipe } from 'fp-ts/function';
import { userFollowedEditorialCommunity } from '../../../src/domain-events';
import { isFollowing } from '../../../src/shared-read-models/followings';
import { groupIdFromString } from '../../types/group-id.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

describe('follows', () => {
  const userId = arbitraryUserId();
  const group1 = groupIdFromString('group-1');

  describe('when the user is not following the group', () => {
    const result = pipe(
      [],
      isFollowing(userId, groupIdFromString('group-1')),
    );

    it('returns false', () => {
      expect(result).toBe(false);
    });
  });

  describe('when the user is following the group', () => {
    const result = pipe(
      [
        userFollowedEditorialCommunity(userId, group1),
      ],
      isFollowing(userId, groupIdFromString('group-1')),
    );

    it('returns true', () => {
      expect(result).toBe(true);
    });
  });
});
