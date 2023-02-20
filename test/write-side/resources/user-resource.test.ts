import { pipe } from 'fp-ts/function';
import { userCreatedAccount } from '../../../src/domain-events';
import * as User from '../../../src/write-side/resources/user-resource';
import { arbitraryUserHandle } from '../../types/user-handle.helper';
import { arbitraryUserId } from '../../types/user-id.helper';
import { arbitraryString, arbitraryUri } from '../../helpers';
import { UserHandle } from '../../../src/types/user-handle';

describe('user-resource', () => {
  describe('exists', () => {
    describe('when the user exists', () => {
      describe('with an identical handle', () => {
        it('returns true', () => {
          const handle = arbitraryUserHandle();
          const result = pipe(
            [
              userCreatedAccount(
                arbitraryUserId(),
                handle,
                arbitraryUri(),
                arbitraryString(),
              ),
            ],
            User.exists(handle),
          );

          expect(result).toBe(true);
        });
      });

      describe('with a handle matching except for case', () => {
        it('returns true', () => {
          const result = pipe(
            [
              userCreatedAccount(
                arbitraryUserId(),
                'ahandle' as UserHandle,
                arbitraryUri(),
                arbitraryString(),
              ),
            ],
            User.exists('AHandle' as UserHandle),
          );

          expect(result).toBe(true);
        });
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
