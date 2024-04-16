import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { constructEvent } from '../../../src/domain-events';
import { getFollowers } from '../../../src/read-models/followings/get-followers';
import { handleEvent, initialState } from '../../../src/read-models/followings/handle-event';
import * as UID from '../../../src/types/user-id';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

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
        constructEvent('UserFollowedEditorialCommunity')({ userId, editorialCommunityId: groupId }),
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
        constructEvent('UserFollowedEditorialCommunity')({ userId, editorialCommunityId: groupId }),
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
        constructEvent('UserFollowedEditorialCommunity')({ userId, editorialCommunityId: groupId }),
        constructEvent('UserFollowedEditorialCommunity')({ userId, editorialCommunityId: arbitraryGroupId() }),
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
        constructEvent('UserFollowedEditorialCommunity')({ userId: userId1, editorialCommunityId: groupId }),
        constructEvent('UserFollowedEditorialCommunity')({ userId: userId2, editorialCommunityId: groupId }),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns the followers sorted alphabetically', () => {
      expect(getFollowers(readmodel)(groupId)).toStrictEqual([userId2, userId1]);
    });
  });
});
