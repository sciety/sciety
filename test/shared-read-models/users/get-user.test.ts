import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { userCreatedAccount } from '../../../src/domain-events/user-created-account-event';
import { handleEvent, initialState } from '../../../src/shared-read-models/users';
import { getUser } from '../../../src/shared-read-models/users/get-user';
import { arbitraryString, arbitraryUri, arbitraryWord } from '../../helpers';
import { arbitraryUserId } from '../../types/user-id.helper';

describe('get-user', () => {
  const userId = arbitraryUserId();

  describe('when user exists', () => {
    const avatarUrl = arbitraryUri();
    const displayName = arbitraryString();
    const handle = arbitraryWord();
    const readModel = pipe(
      [
        userCreatedAccount(userId, handle, avatarUrl, displayName),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns the correct user details', () => {
      expect(getUser(readModel)(userId)).toStrictEqual(O.some({
        avatarUrl,
        displayName,
        handle,
        id: userId,
      }));
    });
  });

  describe('when user does not exist', () => {
    const readModel = pipe(
      [],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns None', () => {
      expect(getUser(readModel)(userId)).toStrictEqual(O.none);
    });
  });
});
