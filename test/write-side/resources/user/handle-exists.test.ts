import { pipe } from 'fp-ts/function';
import { UserHandle } from '../../../../src/types/user-handle';
import * as User from '../../../../src/write-side/resources/user/handle-exists';
import { arbitraryUserCreatedAccountEvent } from '../../../domain-events/user-resource-events.helper';
import { arbitraryUserHandle } from '../../../types/user-handle.helper';

describe('handle-exists', () => {
  describe('when the user exists', () => {
    describe('with an identical handle', () => {
      it('returns true', () => {
        const handle = arbitraryUserHandle();
        const result = pipe(
          [
            {
              ...arbitraryUserCreatedAccountEvent(),
              handle,
            },
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
            {
              ...arbitraryUserCreatedAccountEvent(),
              handle: 'ahandle' as UserHandle,
            },
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
