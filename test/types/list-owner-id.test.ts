import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { arbitraryGroupId } from './group-id.helper.js';
import { arbitraryUserId } from './user-id.helper.js';
import * as LOID from '../../src/types/list-owner-id.js';

describe('list-owner-id', () => {
  describe('given a list owner id that contains a user id', () => {
    const original = LOID.fromUserId(arbitraryUserId());

    it('encodes and decodes to a right of the same value', () => {
      const result = pipe(
        original,
        LOID.fromStringCodec.encode,
        LOID.fromStringCodec.decode,
      );

      expect(result).toStrictEqual(E.right(original));
    });
  });

  describe('given a list owner id that contains a group id', () => {
    const original = LOID.fromGroupId(arbitraryGroupId());

    it('encodes and decodes to a right of the same value', () => {
      const result = pipe(
        original,
        LOID.fromStringCodec.encode,
        LOID.fromStringCodec.decode,
      );

      expect(result).toStrictEqual(E.right(original));
    });
  });

  describe('decoding', () => {
    describe('an invalid tag', () => {
      const result = LOID.fromStringCodec.decode(`foo:${arbitraryUserId()}`);

      it('returns on the left', () => {
        expect(E.isLeft(result)).toBe(true);
      });
    });

    describe('an invalid value', () => {
      const result = LOID.fromStringCodec.decode('user-id:');

      it('returns on the left', () => {
        expect(E.isLeft(result)).toBe(true);
      });
    });

    describe('an invalid separator', () => {
      const result = LOID.fromStringCodec.decode('user-id/12332');

      it('returns on the left', () => {
        expect(E.isLeft(result)).toBe(true);
      });
    });
  });
});
