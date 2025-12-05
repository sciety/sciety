import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import * as Hyp from './hypothesis';
import { Annotation } from './hypothesis/annotation';
import { convertHypothesisAnnotationToEvaluation } from './hypothesis/convert-hypothesis-annotation-to-evaluation';
import { ingestionWindowStartDate } from './ingestion-window-start-date';
import { isUriFromBiorxivMedrxiv } from './is-uri-from-biorxiv-medrxiv';
import { uriIsMissingBiorxivMedrxivDoiPrefix } from './uri-is-missing-biorxiv-medrxiv-doi-prefix';
import { deriveUriContainingBiorxivMedrxivDoiPrefix } from '../derive-uri-containing-biorxiv-medrxiv-doi-prefix';
import { Dependencies, DiscoverPublishedEvaluations } from '../discover-published-evaluations';
import { tagToEvaluationTypeMap } from '../tag-to-evaluation-type-map';

const refineIfNecessaryAnnotationUriForBiorxivMedrxiv = (
  dependencies: Dependencies,
) => (
  annotation: Annotation,
) => pipe(
  annotation.uri,
  (uri) => isUriFromBiorxivMedrxiv(uri) && uriIsMissingBiorxivMedrxivDoiPrefix(uri),
  B.match(
    () => TE.right(annotation),
    () => (process.env.EXPERIMENT_ENABLED === 'true' ? deriveUriContainingBiorxivMedrxivDoiPrefix(dependencies)(annotation) : TE.right(annotation)),
  ),
);

export const discoverEvaluationsFromHypothesisGroup = (
  publisherGroupId: string,
  avoidWhenPublishedBefore?: Date,
): DiscoverPublishedEvaluations => (ingestDays) => (dependencies) => pipe(
  publisherGroupId,
  Hyp.fetchEvaluationsByGroupSince(
    ingestionWindowStartDate(ingestDays, avoidWhenPublishedBefore),
    dependencies.fetchData,
  ),
  TE.flatMap(TE.traverseArray(refineIfNecessaryAnnotationUriForBiorxivMedrxiv(dependencies))),
  TE.map(RA.map(convertHypothesisAnnotationToEvaluation(tagToEvaluationTypeMap))),
  TE.map((parts) => ({
    understood: RA.rights(parts),
    skipped: RA.lefts(parts),
  })),
);
