import * as D from 'fp-ts/Date';
import * as Ord from 'fp-ts/Ord';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import { ExpressionDoi } from '../../../../../types/expression-doi';
import { GroupId } from '../../../../../types/group-id';

type EvaluatedPaper = {
  representative: ExpressionDoi,
  lastEvaluationByThisGroupPublishedAt: Date,
};

const augmentWithSortProperty = (input: ReadonlySet<ExpressionDoi>): ReadonlySet<EvaluatedPaper> => pipe(
  Array.from(input),
  RA.map((expressionDoi) => ({
    representative: expressionDoi,
    lastEvaluationByThisGroupPublishedAt: new Date(),
  })),
  (arrayAugmentedWithSortProperty) => new Set(arrayAugmentedWithSortProperty),
);

const byLastEvaluationByThisGroupPublishedAt: Ord.Ord<EvaluatedPaper> = pipe(
  D.Ord,
  Ord.reverse,
  Ord.contramap((entry) => entry.lastEvaluationByThisGroupPublishedAt),
);

export const constructSortedFeed = (
  dependencies: Dependencies,
  groupId: GroupId,
): ReadonlyArray<ExpressionDoi> => pipe(
  dependencies.getPapersEvaluatedByGroup(groupId),
  augmentWithSortProperty,
  (representatives) => Array.from(representatives),
  RA.sort(byLastEvaluationByThisGroupPublishedAt),
  RA.map((representativeAugmentedWithSortProperty) => representativeAugmentedWithSortProperty.representative),
);
