import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { handleEvent, initialState } from '../../../src/shared-read-models/followings';
import { getFollowers } from '../../../src/shared-read-models/followings/get-followers';
import { arbitraryGroupId } from '../../types/group-id.helper';

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
    it.todo('returns a list containing them as a follower');
  });

  describe('when 1 user has followed then unfollowed the group', () => {
    it.todo('returns empty list');
  });

  describe('when 1 user has followed the group and another group', () => {
    it.todo('returns a list containing them as a follower');
  });

  describe('when multiple users have followed the group', () => {
    it.todo('returns a list containing them as followers');
  });
});
