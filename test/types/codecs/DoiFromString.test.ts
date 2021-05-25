import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { DoiFromString } from '../../../src/types/codecs/DoiFromString';
import { arbitraryDoi } from '../doi.helper';

describe('codec DoiFromString', () => {
  it('encodes and decodes back to the same value', () => {
    const doi = arbitraryDoi();

    expect(pipe(
      doi,
      DoiFromString.encode,
      DoiFromString.decode,
    )).toStrictEqual(E.right(doi));
  });
});
