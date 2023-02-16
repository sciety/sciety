import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { arbitraryUserDetails } from '../../types/user-details.helper';
import { userCreatedAccount } from '../../../src/domain-events';
import * as User from '../../../src/write-side/resources/user-resource';

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
      it.todo('returns not-found');
    });
  });
});
