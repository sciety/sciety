import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { FetchData } from '../fetch-data';
import { tagToEvaluationTypeMap } from '../tag-to-evaluation-type-map';
import * as Hyp from '../third-parties/hypothesis';
import { convertHypothesisAnnotationToEvaluation } from '../third-parties/hypothesis/convert-hypothesis-annotation-to-evaluation';
import { daysAgo } from '../time';
import { DiscoverPublishedEvaluations } from '../update-all';

type Ports = {
  fetchData: FetchData,
};

export const fetchReviewsFromHypothesisGroup = (
  publisherGroupId: string,
  daysToLookBack: number | Date = 5,
): DiscoverPublishedEvaluations => (ports: Ports) => pipe(
  publisherGroupId,
  Hyp.fetchEvaluationsByGroupSince(
    daysToLookBack instanceof Date ? daysToLookBack : daysAgo(daysToLookBack),
    ports.fetchData,
  ),
  TE.map(RA.map(convertHypothesisAnnotationToEvaluation(tagToEvaluationTypeMap))),
  TE.map((parts) => ({
    understood: RA.rights(parts),
    skipped: RA.lefts(parts),
  })),
);
