import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { arbitraryCandidateUserHandle, candidateUserHandleFromString } from '../../types/candidate-user-handle.helper';
import { handleEvent, initialState } from '../../../src/read-models/users/handle-event';
import { lookupUserByHandle } from '../../../src/read-models/users/lookup-user-by-handle';
import { arbitraryUserCreatedAccountEvent } from '../../domain-events/user-resource-events.helper';
import { shouldNotBeCalled } from '../../should-not-be-called';

describe('lookup-user-by-handle', () => {
  const userCreatedAccountEvent = arbitraryUserCreatedAccountEvent();

  describe('when the user exists', () => {
    const readmodel = pipe(
      [
        userCreatedAccountEvent,
      ],
      RA.reduce(initialState(), handleEvent),
    );

    describe('and the requested handle is an identical match', () => {
      const user = pipe(
        userCreatedAccountEvent.handle,
        candidateUserHandleFromString,
        lookupUserByHandle(readmodel),
        O.getOrElseW(shouldNotBeCalled),
      );

      it('returns the user', () => {
        expect(user.id).toStrictEqual(userCreatedAccountEvent.userId);
      });
    });

    describe('and the requested handle only differs in case', () => {
      const user = pipe(
        userCreatedAccountEvent.handle.toUpperCase(),
        candidateUserHandleFromString,
        lookupUserByHandle(readmodel),
        O.getOrElseW(shouldNotBeCalled),
      );

      it('returns the user', () => {
        expect(user.id).toStrictEqual(userCreatedAccountEvent.userId);
      });
    });
  });

  describe('when the user does not exist', () => {
    const readmodel = pipe(
      [],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns none', () => {
      expect(lookupUserByHandle(readmodel)(arbitraryCandidateUserHandle())).toStrictEqual(O.none);
    });
  });
});
