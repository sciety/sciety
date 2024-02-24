import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { arbitraryCandidateUserHandle, candidateUserHandleFromString } from '../../types/candidate-user-handle.helper.js';
import { constructEvent } from '../../../src/domain-events/index.js';
import { handleEvent, initialState } from '../../../src/read-models/users/handle-event.js';
import { lookupUserByHandle } from '../../../src/read-models/users/lookup-user-by-handle.js';
import { arbitraryUserDetails } from '../../types/user-details.helper.js';

describe('lookup-user-by-handle', () => {
  const user = arbitraryUserDetails();

  describe('when the user exists', () => {
    const readmodel = pipe(
      [
        constructEvent('UserCreatedAccount')({
          ...user,
          userId: user.id,
        }),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    describe('and the requested handle is an identical match', () => {
      const candidateHandle = candidateUserHandleFromString(user.handle);

      it('returns the user', () => {
        expect(lookupUserByHandle(readmodel)(candidateHandle)).toStrictEqual(O.some(user));
      });
    });

    describe('and the requested handle only differs in case', () => {
      const candidateHandle = candidateUserHandleFromString(user.handle.toUpperCase());

      it('returns the user', () => {
        expect(lookupUserByHandle(readmodel)(candidateHandle)).toStrictEqual(O.some(user));
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
