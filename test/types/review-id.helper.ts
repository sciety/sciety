import { arbitraryDoi } from './doi.helper';
import { arbitraryHypothesisAnnotationId } from './hypothesis-annotation-id.helper';
import { arbitraryNcrcId } from './ncrc-id.helper';
import { ReviewId } from '../../src/types/review-id';
import { arbitraryNumber } from '../helpers';

const constructors = [
  arbitraryDoi,
  arbitraryHypothesisAnnotationId,
  arbitraryNcrcId,
];

export const arbitraryReviewId = (): ReviewId => constructors[arbitraryNumber(0, 2)]();
