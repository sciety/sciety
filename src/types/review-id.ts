import { Doi } from './doi';
import { HypothesisAnnotationId } from './hypothesis-annotation-id';

export type ReviewId = Doi | HypothesisAnnotationId;

export const toReviewId = (serialization: string): ReviewId => (serialization.startsWith('doi:')
  ? new Doi(serialization)
  : new HypothesisAnnotationId(serialization));
