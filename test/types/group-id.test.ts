import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { arbitraryGroupId } from './group-id.helper';
import * as GID from '../../src/types/group-id';

describe('group-id', () => {
  describe('fromNullable', () => {
    it('returns O.none on a null input', () => {
      expect(GID.fromNullable(null)).toBe(O.none);
    });

    it('returns O.none on an undefined input', () => {
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

  describe('group-id-from-string-codec', () => {
    it('encodes and decodes back to the same value', () => {
      const id = arbitraryGroupId();

      expect(pipe(
        id,
        GID.GroupIdFromStringCodec.encode,
        GID.GroupIdFromStringCodec.decode,
      )).toStrictEqual(E.right(id));
    });
  });
});
