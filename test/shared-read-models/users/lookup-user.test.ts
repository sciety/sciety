import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { userCreatedAccount } from '../../../src/domain-events/user-created-account-event';
import { handleEvent, initialState } from '../../../src/shared-read-models/users';
import { lookupUser } from '../../../src/shared-read-models/users/lookup-user';
import { arbitraryString, arbitraryUri } from '../../helpers';
import { arbitraryUserId } from '../../types/user-id.helper';
import { arbitraryUserHandle } from '../../types/user-handle.helper';

describe('lookup-user', () => {
  const userId = arbitraryUserId();

  describe('when user exists', () => {
    const avatarUrl = arbitraryUri();
    const displayName = arbitraryString();
    const handle = arbitraryUserHandle();
    const readModel = pipe(
      [
        userCreatedAccount(userId, handle, avatarUrl, displayName),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns the correct user details', () => {
      expect(lookupUser(readModel)(userId)).toStrictEqual(O.some({
        avatarUrl,
        displayName,
        handle,
        id: userId,
      }));
    });
  });

  describe('when avatarUrl has been updated', () => {
    it.todo('returns the updated avatarUrl');
  });

  describe('when user does not exist', () => {
    const readModel = pipe(
      [],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns None', () => {
      expect(lookupUser(readModel)(userId)).toStrictEqual(O.none);
    });
  });
});
