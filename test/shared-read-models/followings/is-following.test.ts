import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { arbitraryGroup } from '../../types/group.helper';
import { handleEvent, initialState } from '../../../src/shared-read-models/followings';
import { isFollowing } from '../../../src/shared-read-models/followings/is-following';
import { arbitraryUserId } from '../../types/user-id.helper';

describe('is-following', () => {
  const group = arbitraryGroup();
  const userId = arbitraryUserId();

  describe('when the user is not following the group', () => {
    const readmodel = pipe(
      [],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns false', () => {
      expect(isFollowing(readmodel)(group.id)(userId)).toBe(false);
    });
  });

  describe('when the user followed and then unfollowed the group', () => {
    it.todo('returns false');
  });

  describe('when the user is following the group', () => {
    it.todo('returns true');
  });
});
