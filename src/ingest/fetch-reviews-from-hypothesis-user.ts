import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { FetchData } from './fetch-data';
import { daysAgo } from './time';
import { FetchEvaluations } from './update-all';
import * as Hyp from './third-parties/hypothesis';
import { convertHypothesisAnnotationToEvaluation } from './third-parties/hypothesis/convert-hypothesis-annotation-to-evaluation';
import { tagToEvaluationTypeMap } from './tag-to-evaluation-type-map';

type Ports = {
  fetchData: FetchData,
};

export const fetchReviewsFromHypothesisUser = (
  publisherUserId: string, days = 5,
): FetchEvaluations => (ports: Ports) => pipe(
  publisherUserId,
  Hyp.fetchEvaluationsByUserSince(daysAgo(days), ports.fetchData),
  TE.map(RA.map(convertHypothesisAnnotationToEvaluation(tagToEvaluationTypeMap))),
  TE.map((parts) => ({
    evaluations: RA.rights(parts),
    skippedItems: RA.lefts(parts),
  })),
);
