import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { constructEvent } from '../../../src/domain-events';
import { handleEvent, initialState } from '../../../src/read-models/followings/handle-event';
import { isFollowing } from '../../../src/read-models/followings/is-following';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

describe('is-following', () => {
  const groupId = arbitraryGroupId();
  const userId = arbitraryUserId();

  describe('when the user is not following the group', () => {
    const readmodel = pipe(
      [],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns false', () => {
      expect(isFollowing(readmodel)(groupId)(userId)).toBe(false);
    });
  });

  describe('when the user followed and then unfollowed the group', () => {
    const readmodel = pipe(
      [
        constructEvent('UserFollowedEditorialCommunity')({ userId, editorialCommunityId: groupId }),
        constructEvent('UserUnfollowedEditorialCommunity')({ userId, editorialCommunityId: groupId }),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns false', () => {
      expect(isFollowing(readmodel)(groupId)(userId)).toBe(false);
    });
  });

  describe('when the user is following the group', () => {
    const readmodel = pipe(
      [
        constructEvent('UserFollowedEditorialCommunity')({ userId, editorialCommunityId: groupId }),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns true', () => {
      expect(isFollowing(readmodel)(groupId)(userId)).toBe(true);
    });
  });
});
