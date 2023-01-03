import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../../../src/domain-events/domain-event';
import { userCreatedAccount } from '../../../src/domain-events/user-created-account-event';
import { UserId } from '../../../src/types/user-id';
import { arbitraryString, arbitraryUri, arbitraryWord } from '../../helpers';
import { arbitraryUserId } from '../../types/user-id.helper';

// eslint-disable-next-line @typescript-eslint/ban-types
type ReadModel = {};
const initialState = () => ({});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleEvent = (state: ReadModel, event: DomainEvent) => state;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getUser = (readModel: ReadModel) => (userId: UserId) => O.none;

describe('get-user', () => {
  describe('when user exists', () => {
    const avatarUrl = arbitraryUri();
    const displayName = arbitraryString();
    const handle = arbitraryWord();
    const userId = arbitraryUserId();
    const readModel = pipe(
      [
        userCreatedAccount(userId, handle, avatarUrl, displayName),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it.failing('returns the correct user details', () => {
      expect(getUser(readModel)(userId)).toStrictEqual(O.some({
        avatarUrl,
        displayName,
        handle,
        userId,
      }));
    });
  });

  describe('when user does not exist', () => {
    it.todo('returns None');
  });
});
