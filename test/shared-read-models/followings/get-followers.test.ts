import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { constructEvent, userFollowedEditorialCommunity } from '../../../src/domain-events';
import { handleEvent, initialState } from '../../../src/shared-read-models/followings';
import { getFollowers } from '../../../src/shared-read-models/followings/get-followers';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryUserId } from '../../types/user-id.helper';
import * as UID from '../../../src/types/user-id';

describe('get-users-following', () => {
  const groupId = arbitraryGroupId();

  describe('when no users have followed the group', () => {
    const readmodel = pipe(
      [],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns an empty list', () => {
      expect(getFollowers(readmodel)(groupId)).toStrictEqual([]);
    });
  });

  describe('when 1 user has followed the group', () => {
    const userId = arbitraryUserId();
    const readmodel = pipe(
      [
        userFollowedEditorialCommunity(userId, groupId),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns a list containing them as a follower', () => {
      expect(getFollowers(readmodel)(groupId)).toStrictEqual([userId]);
    });
  });

  describe('when 1 user has followed then unfollowed the group', () => {
    const userId = arbitraryUserId();
    const readmodel = pipe(
      [
        userFollowedEditorialCommunity(userId, groupId),
        constructEvent('UserUnfollowedEditorialCommunity')({ userId, editorialCommunityId: groupId }),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns an empty list', () => {
      expect(getFollowers(readmodel)(groupId)).toStrictEqual([]);
    });
  });

  describe('when 1 user has followed the group and another group', () => {
    const userId = arbitraryUserId();
    const readmodel = pipe(
      [
        userFollowedEditorialCommunity(userId, groupId),
        userFollowedEditorialCommunity(userId, arbitraryGroupId()),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns a list containing them as a follower', () => {
      expect(getFollowers(readmodel)(groupId)).toStrictEqual([userId]);
    });
  });

  describe('when multiple users have followed the group', () => {
    const userId1 = arbitraryUserId(UID.twitterPrefix);
    const userId2 = arbitraryUserId(UID.auth0Prefix);
    const readmodel = pipe(
      [
        userFollowedEditorialCommunity(userId1, groupId),
        userFollowedEditorialCommunity(userId2, groupId),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns the followers sorted alphabetically', () => {
      expect(getFollowers(readmodel)(groupId)).toStrictEqual([userId2, userId1]);
    });
  });
});
