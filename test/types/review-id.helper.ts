import { v4 } from 'uuid';
import { ReviewId } from '../../src/types/review-id';
import { arbitraryNumber, arbitraryWord } from '../helpers';

const arbitraryReviewDoi = (): ReviewId => (
  `doi:${arbitraryWord(20)}` as ReviewId
);

const arbitraryHypothesisAnnotationId = (): ReviewId => (
  `hypothesis:${arbitraryWord(20)}` as ReviewId
);

export const arbitraryNcrcId = (): ReviewId => (
  `ncrc:${v4()}` as ReviewId
);

const constructors = [
  arbitraryReviewDoi,
  arbitraryHypothesisAnnotationId,
  arbitraryNcrcId,
];

export const arbitraryReviewId = (): ReviewId => constructors[arbitraryNumber(0, constructors.length - 1)]();
