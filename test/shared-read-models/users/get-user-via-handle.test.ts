import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { userCreatedAccount } from '../../../src/domain-events';
import { handleEvent, initialState } from '../../../src/shared-read-models/users';
import { getUserViaHandle } from '../../../src/shared-read-models/users/get-user-via-handle';
import { UserDetails } from '../../../src/types/user-details';
import { arbitraryString, arbitraryUri, arbitraryWord } from '../../helpers';
import { arbitraryUserId } from '../../types/user-id.helper';

const arbitraryUser = (): UserDetails => ({
  id: arbitraryUserId(),
  handle: arbitraryWord(),
  displayName: arbitraryString(),
  avatarUrl: arbitraryUri(),
});

describe('getUserViaHandle', () => {
  const user = arbitraryUser();

  describe('when the user exists', () => {
    const readmodel = pipe(
      [
        userCreatedAccount(user.id, user.handle, user.avatarUrl, user.displayName),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns the user', () => {
      expect(getUserViaHandle(readmodel)(user.handle)).toStrictEqual(O.some(user));
    });
  });

  describe('when the user does not exist', () => {
    const readmodel = pipe(
      [],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns none', () => {
      expect(getUserViaHandle(readmodel)(user.handle)).toStrictEqual(O.none);
    });
  });
});
