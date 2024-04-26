import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { FetchEvaluations } from './update-all';

export const fetchReviewsFromAccessMicrobiology: FetchEvaluations = (dependencies) => pipe(
  'https://api.crossref.org/works?filter=prefix:10.1099,type:peer-review,relation.type:is-review-of',
  dependencies.fetchData,
  TE.map(() => ({
    evaluations: [],
    skippedItems: [],
  })),
);
