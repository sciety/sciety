import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { Queries } from '../../read-models';
import { byMostRecentlyPublished, isCurationStatement } from '../../read-models/evaluations';
import * as PH from '../../types/publishing-history';
import {
  GroupLinkAsTextViewModel, GroupLinkWithLogoViewModel, constructGroupLink, ConstructGroupLinkDependencies,
} from '../html-pages/shared-components/group-link';

export type Dependencies = Queries
& ConstructGroupLinkDependencies;

const unique = <A>(input: ReadonlyArray<A>) => [...new Set(input)];

export const constructReviewingGroups = (
  dependencies: Dependencies,
  publishingHistory: PH.PublishingHistory,
): ReadonlyArray<GroupLinkWithLogoViewModel & GroupLinkAsTextViewModel> => pipe(
  publishingHistory,
  PH.getAllExpressionDois,
  dependencies.getEvaluationsOfMultipleExpressions,
  RA.filter((recordedEvaluation) => !isCurationStatement(recordedEvaluation)),
  RA.sort(byMostRecentlyPublished),
  RA.map((evaluation) => evaluation.groupId),
  unique,
  RA.map(constructGroupLink(dependencies)),
  RA.compact,
);
