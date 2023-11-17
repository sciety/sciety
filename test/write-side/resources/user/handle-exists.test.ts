import { pipe } from 'fp-ts/function';
import { arbitraryUserHandle } from '../../../types/user-handle.helper.js';
import { constructEvent } from '../../../../src/domain-events/index.js';
import { arbitraryUserId } from '../../../types/user-id.helper.js';
import { arbitraryString, arbitraryUri } from '../../../helpers.js';
import * as User from '../../../../src/write-side/resources/user/handle-exists.js';
import { UserHandle } from '../../../../src/types/user-handle.js';

describe('handle-exists', () => {
  describe('when the user exists', () => {
    describe('with an identical handle', () => {
      it('returns true', () => {
        const handle = arbitraryUserHandle();
        const result = pipe(
          [
            constructEvent('UserCreatedAccount')({
              userId: arbitraryUserId(),
              handle,
              avatarUrl: arbitraryUri(),
              displayName: arbitraryString(),
            }),
          ],
          User.handleExists(handle),
        );

        expect(result).toBe(true);
      });
    });

    describe('with a handle matching except for case', () => {
      it('returns true', () => {
        const result = pipe(
          [
            constructEvent('UserCreatedAccount')({
              userId: arbitraryUserId(),
              handle: 'ahandle' as UserHandle,
              avatarUrl: arbitraryUri(),
              displayName: arbitraryString(),
            }),
          ],
          User.handleExists('AHandle' as UserHandle),
        );

        expect(result).toBe(true);
      });
    });
  });

  describe('when the user does not exist', () => {
    it('returns false', () => {
      const result = pipe(
        [],
        User.handleExists(arbitraryUserHandle()),
      );

      expect(result).toBe(false);
    });
  });
});
