import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { arbitraryCandidateUserHandle } from '../../types/candidate-user-handle.helper';
import { userCreatedAccount } from '../../../src/domain-events';
import { handleEvent, initialState } from '../../../src/shared-read-models/users';
import { lookupUserByHandle } from '../../../src/shared-read-models/users/lookup-user-by-handle';
import { arbitraryUserDetails } from '../../types/user-details.helper';
import { CandidateUserHandle } from '../../../src/types/candidate-user-handle';

describe('lookup-user-by-handle', () => {
  const user = arbitraryUserDetails();

  describe('when the user exists', () => {
    const readmodel = pipe(
      [
        userCreatedAccount(user.id, user.handle, user.avatarUrl, user.displayName),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    describe('and the requested handle is an identical match', () => {
      const candidateHandle = user.handle as string as CandidateUserHandle;

      it('returns the user', () => {
        expect(lookupUserByHandle(readmodel)(candidateHandle)).toStrictEqual(O.some(user));
      });
    });

    describe('and the requested handle only differs in case', () => {
      const candidateHandle = user.handle.toUpperCase() as CandidateUserHandle;

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
