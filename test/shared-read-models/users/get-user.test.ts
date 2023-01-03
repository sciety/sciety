/* eslint-disable no-param-reassign */
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../../../src/domain-events/domain-event';
import { isUserCreatedAccountEvent, userCreatedAccount } from '../../../src/domain-events/user-created-account-event';
import { UserId } from '../../../src/types/user-id';
import { arbitraryString, arbitraryUri, arbitraryWord } from '../../helpers';
import { arbitraryUserId } from '../../types/user-id.helper';

type UserDetails = {
  avatarUrl: string,
  displayName: string,
  handle: string,
  userId: UserId,
};

type ReadModel = Record<UserId, UserDetails>;

const initialState = (): ReadModel => ({});

const handleEvent = (readModel: ReadModel, event: DomainEvent): ReadModel => {
  if (isUserCreatedAccountEvent(event)) {
    readModel[event.userId] = {
      avatarUrl: event.avatarUrl,
      displayName: event.displayName,
      handle: event.handle,
      userId: event.userId,
    };
  }
  return readModel;
};

const getUser = (readModel: ReadModel) => (userId: UserId) => pipe(
  readModel,
  R.lookup(userId),
);

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
        userId,
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
