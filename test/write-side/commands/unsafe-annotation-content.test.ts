import * as E from 'fp-ts/Either';
import { unsafeAnnotationContentCodec } from '../../../src/write-side/commands/unsafe-annotation-content';

describe('unsafe-annotation-content', () => {
  describe('when decoding an empty string', () => {
    const result = unsafeAnnotationContentCodec.decode('');

    it('fails', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });

  describe('when decoding a string that is too long', () => {
    it.todo('fails');
  });

  describe('when decoding a valid annotation', () => {
    it.todo('succeeds');
  });
});
