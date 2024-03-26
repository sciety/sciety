import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { arbitraryUserId } from '../../types/user-id.helper';
import { arbitraryString } from '../../helpers';
import { handleEvent, initialState } from '../../../src/read-models/users/handle-event';
import { lookupUser } from '../../../src/read-models/users/lookup-user';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryUserCreatedAccountEvent, arbitraryUserDetailsUpdatedEvent } from '../../domain-events/user-resource-events.helper';

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
        {
          ...arbitraryUserDetailsUpdatedEvent(),
          userId: accountCreatedEvent.userId,
          displayName: newDisplayName,
        },
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
