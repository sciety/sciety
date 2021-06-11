import { ReviewId } from '../../src/types/review-id';
import { arbitraryWord } from '../helpers';

export const arbitraryHypothesisAnnotationId = (): ReviewId => (
  `hypothesis:${arbitraryWord(20)}` as ReviewId
);
