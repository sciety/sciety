import * as E from 'fp-ts/Either';
import { unsafeAnnotationContentCodec } from '../../../src/write-side/commands/unsafe-annotation-content';
import { arbitraryString, arbitraryWord } from '../../helpers';

describe('unsafe-annotation-content', () => {
  describe('when decoding an empty string', () => {
    const result = unsafeAnnotationContentCodec.decode('');

    it('fails', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });

  describe('when decoding a string that is too long', () => {
    const result = unsafeAnnotationContentCodec.decode(arbitraryWord(5000));

    it('fails', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });

  describe('when decoding a valid annotation', () => {
    const result = unsafeAnnotationContentCodec.decode(arbitraryString());

    it('succeeds', () => {
      expect(E.isRight(result)).toBe(true);
    });
  });
});
