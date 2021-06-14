import { arbitraryHypothesisAnnotationId } from './hypothesis-annotation-id.helper';
import { arbitraryNcrcId } from './ncrc-id.helper';
import { ReviewId } from '../../src/types/review-id';
import { arbitraryNumber } from '../helpers';

const constructors = [
  arbitraryHypothesisAnnotationId,
  arbitraryNcrcId,
];

export const arbitraryReviewId = (): ReviewId => constructors[arbitraryNumber(0, 1)]();
