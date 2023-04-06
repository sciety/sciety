import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { arbitraryUserId } from '../../types/user-id.helper';
import { TestFramework, createTestFramework } from '../../framework';
import { arbitraryUserDetails } from '../../types/user-details.helper';
import { arbitraryUri } from '../../helpers';
import { userCreatedAccount, userDetailsUpdated } from '../../../src/domain-events';
import { handleEvent, initialState } from '../../../src/shared-read-models/users';
import { lookupUser } from '../../../src/shared-read-models/users/lookup-user';

describe('lookup-user', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

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

  describe('when user does not exist', () => {
    it('returns None', () => {
      const result = framework.queries.lookupUser(arbitraryUserId());

      expect(result).toStrictEqual(O.none);
    });
  });
});
