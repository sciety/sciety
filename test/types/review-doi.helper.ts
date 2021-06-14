import { ReviewId } from '../../src/types/review-id';
import { arbitraryWord } from '../helpers';

export const arbitraryReviewDoi = (): ReviewId => (
  `doi:${arbitraryWord(20)}` as ReviewId
);
