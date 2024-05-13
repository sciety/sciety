import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { ingestionWindowStartDate } from './ingestion-window-start-date';
import { DiscoverPublishedEvaluations } from '../discover-published-evaluations';
import { tagToEvaluationTypeMap } from '../tag-to-evaluation-type-map';
import * as Hyp from '../third-parties/hypothesis';
import { convertHypothesisAnnotationToEvaluation } from '../third-parties/hypothesis/convert-hypothesis-annotation-to-evaluation';

export const discoverEvaluationsFromHypothesisGroup = (
  publisherGroupId: string,
  avoidWhenPublishedBefore?: Date,
): DiscoverPublishedEvaluations => (ingestDays) => (dependencies) => pipe(
  publisherGroupId,
  Hyp.fetchEvaluationsByGroupSince(
    ingestionWindowStartDate(ingestDays, avoidWhenPublishedBefore),
    dependencies.fetchData,
  ),
  TE.map(RA.map(convertHypothesisAnnotationToEvaluation(tagToEvaluationTypeMap))),
  TE.map((parts) => ({
    understood: RA.rights(parts),
    skipped: RA.lefts(parts),
  })),
);
