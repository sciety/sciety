import { pipe } from 'fp-ts/function';
import { arbitraryUserDetails } from '../../types/user-details.helper';
import { userCreatedAccount } from '../../../src/domain-events';
import * as User from '../../../src/write-side/resources/user-resource';
import { arbitraryUserHandle } from '../../types/user-handle.helper';

describe('user-resource', () => {
  describe('exists', () => {
    describe('when the user exists', () => {
      describe('with an identical handle', () => {
        it('returns true', () => {
          const userDetails = arbitraryUserDetails();
          const result = pipe(
            [
              userCreatedAccount(
                userDetails.id,
                userDetails.handle,
                userDetails.avatarUrl,
                userDetails.displayName,
              ),
            ],
            User.exists(userDetails.handle),
          );

          expect(result).toBe(true);
        });
      });

      describe('with a handle matching except for case', () => {
        it.todo('returns true');
      });
    });

    describe('when the user does not exist', () => {
      it('returns false', () => {
        const result = pipe(
          [],
          User.exists(arbitraryUserHandle()),
        );

        expect(result).toBe(false);
      });
    });
  });
});
