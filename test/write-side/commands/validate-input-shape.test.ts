import * as E from 'fp-ts/Either';
import { identity, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { validateInputShape } from '../../../src/write-side/commands/validate-input-shape';
import { arbitraryNumber, arbitraryString } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';

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
    const errorMessage = pipe(
      {
        fakeFieldName: arbitraryString(),
      },
      validateInputShape(fakeCommandCodec),
      E.match(
        identity,
        shouldNotBeCalled,
      ),
    );

    it('returns an error message', () => {
      expect(errorMessage).not.toHaveLength(0);
    });
  });
});
