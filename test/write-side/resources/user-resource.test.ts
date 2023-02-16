import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as DE from '../../../src/types/data-error';
import { arbitraryUserDetails } from '../../types/user-details.helper';
import { userCreatedAccount } from '../../../src/domain-events';
import * as User from '../../../src/write-side/resources/user-resource';
import { arbitraryUserHandle } from '../../types/user-handle.helper';

describe('user-resource', () => {
  describe('exists', () => {
    describe('when the user exists', () => {
      describe('with an identical handle', () => {
        it.failing('returns the user', () => {
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

          expect(result).toStrictEqual(E.right(userDetails));
        });
      });

      describe('with a handle matching except for case', () => {
        it.todo('returns the user');
      });
    });

    describe('when the user does not exist', () => {
      it('returns not-found', () => {
        const result = pipe(
          [],
          User.exists(arbitraryUserHandle()),
        );

        expect(result).toStrictEqual(E.left(DE.notFound));
      });
    });
  });
});
