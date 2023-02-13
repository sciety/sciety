import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { userCreatedAccount } from '../../../src/domain-events';
import { handleEvent, initialState } from '../../../src/shared-read-models/users';
import { lookupUser } from '../../../src/shared-read-models/users/lookup-user';
import { arbitraryUserDetails } from '../../types/user-details.helper';
import {UserHandle} from '../../../src/types/user-handle';

describe('lookupUser', () => {
  const user = arbitraryUserDetails();

  describe('when the requested handle matches that of an existing user in a case sensitive way', () => {
    const readmodel = pipe(
      [
        userCreatedAccount(user.id, user.handle, user.avatarUrl, user.displayName),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns the user', () => {
      expect(lookupUser(readmodel)(user.handle)).toStrictEqual(O.some(user));
    });
  });

  describe('when the requested handle matches that of an existing user in a case insensitive way', () => {
    const readmodel = pipe(
      [
        userCreatedAccount(user.id, user.handle, user.avatarUrl, user.displayName),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it.failing('returns the user', () => {
      expect(lookupUser(readmodel)(user.handle.toUpperCase() as UserHandle)).toStrictEqual(O.some(user));
    });
  });

  describe('when the user does not exist', () => {
    const readmodel = pipe(
      [],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns none', () => {
      expect(lookupUser(readmodel)(user.handle)).toStrictEqual(O.none);
    });
  });
});
