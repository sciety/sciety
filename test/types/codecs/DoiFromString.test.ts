import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { DoiFromString } from '../../../src/types/article-id';
import { arbitraryArticleId } from '../article-id.helper';

describe('codec DoiFromString', () => {
  it('encodes and decodes back to the same value', () => {
    const doi = arbitraryArticleId();

    expect(pipe(
      doi,
      DoiFromString.encode,
      DoiFromString.decode,
    )).toStrictEqual(E.right(doi));
  });
});
