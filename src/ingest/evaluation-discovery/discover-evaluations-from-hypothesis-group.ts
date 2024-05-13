import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { FetchData } from '../fetch-data';
import { tagToEvaluationTypeMap } from '../tag-to-evaluation-type-map';
import * as Hyp from '../third-parties/hypothesis';
import { convertHypothesisAnnotationToEvaluation } from '../third-parties/hypothesis/convert-hypothesis-annotation-to-evaluation';
import { ingestionWindowStartDate } from '../time';
import { DiscoverPublishedEvaluations } from '../update-all';

type Ports = {
  fetchData: FetchData,
};

const calculateEarliestPublicationDateToConsider = (
  earliestPublicationDateToConsider: Date | undefined,
  ingestDays: number,
): Date => (
  earliestPublicationDateToConsider instanceof Date
    ? earliestPublicationDateToConsider
    : ingestionWindowStartDate(ingestDays)
);

export const discoverEvaluationsFromHypothesisGroup = (
  publisherGroupId: string,
  avoidWhenPublishedBefore?: Date,
): DiscoverPublishedEvaluations => (ingestDays) => (ports: Ports) => pipe(
  publisherGroupId,
  Hyp.fetchEvaluationsByGroupSince(
    calculateEarliestPublicationDateToConsider(avoidWhenPublishedBefore, ingestDays),
    ports.fetchData,
  ),
  TE.map(RA.map(convertHypothesisAnnotationToEvaluation(tagToEvaluationTypeMap))),
  TE.map((parts) => ({
    understood: RA.rights(parts),
    skipped: RA.lefts(parts),
  })),
);
