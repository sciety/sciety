import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { FetchEvaluations } from './update-all';

export const fetchReviewsFromAccessMicrobiology: FetchEvaluations = (dependencies) => pipe(
  'example.com',
  dependencies.fetchData,
  () => TE.right({
    evaluations: [],
    skippedItems: [],
  }),
);
