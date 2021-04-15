import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import * as GID from '../../src/types/group-id';

describe('group-id', () => {
  describe('fromNullable', () => {
    it('returns O.none on a null input', () => {
      expect(GID.fromNullable(undefined)).toBe(O.none);
    });

    it('returns O.Some on a valid, not null input', () => {
      expect(pipe(
        'testId',
        GID.fromNullable,
        O.isSome,
      )).toBe(true);
    });
  });
});
