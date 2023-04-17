import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { UserId } from '../../../src/types/user-id';
import { arbitraryUserDetails } from '../../types/user-details.helper';
import { handleEvent, initialState } from '../../../src/shared-read-models/users';
import { userCreatedAccount } from '../../../src/domain-events';
import { ReadModel } from '../../../src/shared-read-models/users/handle-event';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getUser = (readModel: ReadModel) => (userId: UserId) => ({});

describe('get user', () => {
  describe('when the user exists', () => {
    const user = arbitraryUserDetails();
    const readModel = pipe(
      [
        userCreatedAccount(user.id, user.handle, user.avatarUrl, user.displayName),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it.failing('returns relevant user details', () => {
      expect(getUser(readModel)(user.id)).toStrictEqual(user);
    });
  });

  describe('when the user does not exist', () => {
    it.todo('throws an error');
  });
});
