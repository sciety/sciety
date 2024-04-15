import { pipe } from 'fp-ts/function';
import * as D from 'fp-ts/Date';
import * as Ord from 'fp-ts/Ord';
import * as RA from 'fp-ts/ReadonlyArray';
import * as O from 'fp-ts/Option';
import {
  GroupLinkAsTextViewModel, GroupLinkWithLogoViewModel, constructGroupLink, ConstructGroupLinkDependencies,
} from '../../html-pages/shared-components/group-link';
import { RecordedEvaluation } from '../../types/recorded-evaluation';
import { Queries } from '../../read-models';
import * as PH from '../../types/publishing-history';

export type Dependencies = Queries
& ConstructGroupLinkDependencies;

const isNotCurationStatement = (evaluation: RecordedEvaluation) => pipe(
  evaluation.type,
  O.getOrElseW(() => undefined),
) !== 'curation-statement';

const byPublishedAt: Ord.Ord<RecordedEvaluation> = pipe(
  D.Ord,
  Ord.reverse,
  Ord.contramap((evaluation) => evaluation.publishedAt),
);

const unique = <A>(input: ReadonlyArray<A>) => [...new Set(input)];

export const constructReviewingGroups = (
  dependencies: Dependencies,
  publishingHistory: PH.PublishingHistory,
): ReadonlyArray<GroupLinkWithLogoViewModel & GroupLinkAsTextViewModel> => pipe(
  publishingHistory,
  PH.getAllExpressionDois,
  dependencies.getEvaluationsOfMultipleExpressions,
  RA.filter(isNotCurationStatement),
  RA.sort(byPublishedAt),
  RA.map((evaluation) => evaluation.groupId),
  unique,
  RA.map(constructGroupLink(dependencies)),
  RA.compact,
);
