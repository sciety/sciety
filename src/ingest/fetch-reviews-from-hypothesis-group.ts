import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { FetchData } from './fetch-data';
import { daysAgo } from './time';
import { FetchEvaluations } from './update-all';
import * as Hyp from '../third-parties/hypothesis';
import { convertHypothesisAnnotationToEvaluation } from './convert-hypothesis-annotation-to-evaluation';

type Ports = {
  fetchData: FetchData,
};

export const fetchReviewsFromHypothesisGroup = (
  publisherGroupId: string,
  daysToLookBack: number | Date = 5,
): FetchEvaluations => (ports: Ports) => pipe(
  publisherGroupId,
  Hyp.fetchEvaluationsByGroupSince(
    daysToLookBack instanceof Date ? daysToLookBack : daysAgo(daysToLookBack),
    ports.fetchData,
  ),
  TE.map(RA.map(convertHypothesisAnnotationToEvaluation)),
  TE.map((parts) => ({
    evaluations: RA.rights(parts),
    skippedItems: RA.lefts(parts),
  })),
);
