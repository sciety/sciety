import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { ReviewIdFromString } from '../../../src/types/codecs/ReviewIdFromString';
import { ReviewId } from '../../../src/types/review-id';
import { arbitraryDoi } from '../doi.helper';
import { arbitraryHypothesisAnnotationId } from '../hypothesis-annotation-id.helper';
import { arbitraryNcrcId } from '../ncrc-id.helper';

describe('codec ReviewIdFromString', () => {
  it.each([
    [arbitraryHypothesisAnnotationId()],
    [arbitraryNcrcId()],
    [arbitraryDoi()],
  ])('encodes and decodes back to the same value %s', (id: ReviewId) => {
    expect(pipe(
      id,
      ReviewIdFromString.encode,
      ReviewIdFromString.decode,
    )).toStrictEqual(E.right(id));
  });
});
