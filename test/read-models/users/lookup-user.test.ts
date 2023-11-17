import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { arbitraryUserId } from '../../types/user-id.helper.js';
import { arbitraryUserDetails } from '../../types/user-details.helper.js';
import { arbitraryString, arbitraryUri } from '../../helpers.js';
import { constructEvent } from '../../../src/domain-events/index.js';
import { handleEvent, initialState } from '../../../src/read-models/users/handle-event.js';
import { lookupUser } from '../../../src/read-models/users/lookup-user.js';

describe('lookup-user', () => {
  describe('when user exists', () => {
    const user = arbitraryUserDetails();
    const readModel = pipe(
      [
        constructEvent('UserCreatedAccount')({
          userId: user.id,
          handle: user.handle,
          avatarUrl: user.avatarUrl,
          displayName: user.displayName,
        }),
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
        constructEvent('UserCreatedAccount')({
          userId: user.id,
          handle: user.handle,
          avatarUrl: user.avatarUrl,
          displayName: user.displayName,
        }),
        constructEvent('UserDetailsUpdated')({
          userId: user.id,
          avatarUrl: newAvatarUrl,
          displayName: undefined,
        }),
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
        constructEvent('UserCreatedAccount')({
          userId: user.id,
          handle: user.handle,
          avatarUrl: user.avatarUrl,
          displayName: user.displayName,
        }),
        constructEvent('UserDetailsUpdated')({
          userId: user.id,
          avatarUrl: undefined,
          displayName: newDisplayName,
        }),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns the updated displayName', () => {
      expect(lookupUser(readModel)(user.id)).toStrictEqual(O.some({
        ...user,
        displayName: newDisplayName,
      }));
    });
  });

  describe('when displayName and avatarUrl have been updated simultaneously', () => {
    const user = arbitraryUserDetails();
    const newDisplayName = arbitraryString();
    const newAvatarUrl = arbitraryUri();
    const readModel = pipe(
      [
        constructEvent('UserCreatedAccount')({
          userId: user.id,
          handle: user.handle,
          avatarUrl: user.avatarUrl,
          displayName: user.displayName,
        }),
        constructEvent('UserDetailsUpdated')({
          userId: user.id,
          avatarUrl: newAvatarUrl,
          displayName: newDisplayName,
        }),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns the updated displayName and avatarUrl', () => {
      expect(lookupUser(readModel)(user.id)).toStrictEqual(O.some({
        ...user,
        displayName: newDisplayName,
        avatarUrl: newAvatarUrl,
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
