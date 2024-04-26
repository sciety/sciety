import * as TE from 'fp-ts/TaskEither';
import { FetchEvaluations } from './update-all';

export const fetchReviewsFromAccessMicrobiology: FetchEvaluations = () => TE.right({
  evaluations: [],
  skippedItems: [],
});
