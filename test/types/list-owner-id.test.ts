import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { arbitraryUserId } from './user-id.helper';
import * as LOID from '../../src/types/list-owner-id';

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
    it.todo('encodes and decodes to a right of the same value');
  });

  describe('given an invalid tag', () => {
    it.todo('returns on the left');
  });

  describe('given an invalid value', () => {
    it.todo('returns on the left');
  });

  describe('given an invalid separator', () => {
    it.todo('returns on the left');
  });
});
