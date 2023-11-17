import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { FetchData } from './fetch-data.js';
import { daysAgo } from './time.js';
import { FetchEvaluations } from './update-all.js';
import * as Hyp from './third-parties/hypothesis/index.js';
import { convertHypothesisAnnotationToEvaluation } from './third-parties/hypothesis/convert-hypothesis-annotation-to-evaluation.js';
import { tagToEvaluationTypeMap } from './tag-to-evaluation-type-map.js';

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
  TE.map(RA.map(convertHypothesisAnnotationToEvaluation(tagToEvaluationTypeMap))),
  TE.map((parts) => ({
    evaluations: RA.rights(parts),
    skippedItems: RA.lefts(parts),
  })),
);
