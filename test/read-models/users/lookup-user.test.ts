import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { arbitraryUserId } from '../../types/user-id.helper';
import { arbitraryString, arbitraryUri } from '../../helpers';
import { constructEvent, EventOfType } from '../../../src/domain-events';
import { handleEvent, initialState } from '../../../src/read-models/users/handle-event';
import { lookupUser } from '../../../src/read-models/users/lookup-user';
import { arbitraryUserHandle } from '../../types/user-handle.helper';
import { shouldNotBeCalled } from '../../should-not-be-called';

const arbitraryUserCreatedAccountEvent = (): EventOfType<'UserCreatedAccount'> => constructEvent('UserCreatedAccount')(
  {
    userId: arbitraryUserId(),
    avatarUrl: arbitraryUri(),
    displayName: arbitraryString(),
    handle: arbitraryUserHandle(),
  },
);

describe('lookup-user', () => {
  describe('when user exists', () => {
    const event = arbitraryUserCreatedAccountEvent();
    const readModel = pipe(
      [
        event,
      ],
      RA.reduce(initialState(), handleEvent),
    );
    const user = pipe(
      event.userId,
      lookupUser(readModel),
      O.getOrElseW(shouldNotBeCalled),
    );

    it('returns the correct user details', () => {
      expect(user.displayName).toStrictEqual(event.displayName);
      expect(user.handle).toStrictEqual(event.handle);
    });
  });

  describe('when displayName has been updated', () => {
    const accountCreatedEvent = arbitraryUserCreatedAccountEvent();
    const newDisplayName = arbitraryString();
    const readModel = pipe(
      [
        accountCreatedEvent,
        constructEvent('UserDetailsUpdated')({
          userId: accountCreatedEvent.userId,
          avatarUrl: undefined,
          displayName: newDisplayName,
        }),
      ],
      RA.reduce(initialState(), handleEvent),
    );
    const user = pipe(
      accountCreatedEvent.userId,
      lookupUser(readModel),
      O.getOrElseW(shouldNotBeCalled),
    );

    it('returns the updated displayName', () => {
      expect(user.displayName).toStrictEqual(newDisplayName);
    });
  });

  describe('when user does not exist', () => {
    const readModel = initialState();

    it('returns None', () => {
      expect(lookupUser(readModel)(arbitraryUserId())).toStrictEqual(O.none);
    });
  });
});
