import * as E from 'fp-ts/Either';
import * as t from 'io-ts';
import { validateInputShape } from '../../../src/write-side/commands/validate-input-shape.js';
import { arbitraryNumber, arbitraryString } from '../../helpers.js';

describe('validate-input-shape', () => {
  const fakeFieldName = arbitraryNumber(1, 100);

  const fakeCommandCodec = t.type({
    fakeFieldName: t.number,
  });

  describe('when the input is valid', () => {
    it('returns a Command', () => {
      const result = validateInputShape(fakeCommandCodec)({
        fakeFieldName,
      });

      expect(result).toStrictEqual(E.right({
        fakeFieldName,
      }));
    });
  });

  describe('when the input is invalid', () => {
    it('returns an error message', () => {
      const result = validateInputShape(fakeCommandCodec)({
        fakeFieldName: arbitraryString(),
      });

      expect(result).toStrictEqual(E.left(expect.stringMatching(/.+/)));
    });
  });
});
