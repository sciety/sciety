import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { arbitraryUserId } from '../../types/user-id.helper';
import { arbitraryUserDetails } from '../../types/user-details.helper';
import { arbitraryString, arbitraryUri } from '../../helpers';
import { userCreatedAccount, userDetailsUpdated } from '../../../src/domain-events';
import { handleEvent, initialState } from '../../../src/shared-read-models/users';
import { lookupUser } from '../../../src/shared-read-models/users/lookup-user';

describe('lookup-user', () => {
  describe('when user exists', () => {
    const user = arbitraryUserDetails();
    const readModel = pipe(
      [
        userCreatedAccount(user.id, user.handle, user.avatarUrl, user.displayName),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns the correct user details', () => {
      expect(lookupUser(readModel)(user.id)).toStrictEqual(O.some(user));
    });
  });

  describe('when avatarUrl has been updated', () => {
    const user = arbitraryUserDetails();
    const newAvatarUrl = arbitraryUri();
    const readModel = pipe(
      [
        userCreatedAccount(user.id, user.handle, user.avatarUrl, user.displayName),
        userDetailsUpdated(user.id, newAvatarUrl),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns the updated avatarUrl', () => {
      expect(lookupUser(readModel)(user.id)).toStrictEqual(O.some({
        ...user,
        avatarUrl: newAvatarUrl,
      }));
    });
  });

  describe('when displayName has been updated', () => {
    const user = arbitraryUserDetails();
    const newDisplayName = arbitraryString();
    const readModel = pipe(
      [
        userCreatedAccount(user.id, user.handle, user.avatarUrl, user.displayName),
        userDetailsUpdated(user.id, undefined, newDisplayName),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it.failing('returns the updated displayName', () => {
      expect(lookupUser(readModel)(user.id)).toStrictEqual(O.some({
        ...user,
        displayName: newDisplayName,
      }));
    });
  });

  describe('when user does not exist', () => {
    const readModel = initialState();

    it('returns None', () => {
      expect(lookupUser(readModel)(arbitraryUserId())).toStrictEqual(O.none);
    });
  });
});
