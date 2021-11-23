import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { FetchData } from './fetch-data';
import { toEvaluation } from './fetch-reviews-from-hypothesis-group';
import { daysAgo } from './time';
import { FetchEvaluations } from './update-all';
import * as Hyp from '../third-parties/hypothesis';

type Ports = {
  fetchData: FetchData,
};

export const fetchReviewsFromHypothesisUser = (publisherUserId: string): FetchEvaluations => (ports: Ports) => pipe(
  publisherUserId,
  Hyp.fetchEvaluationsByUserSince(daysAgo(5), ports.fetchData),
  TE.map(RA.map(toEvaluation)),
  TE.map((parts) => ({
    evaluations: RA.rights(parts),
    skippedItems: RA.lefts(parts),
  })),
);
