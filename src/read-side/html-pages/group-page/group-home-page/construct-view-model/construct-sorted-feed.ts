import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import { ExpressionDoi } from '../../../../../types/expression-doi';
import { GroupId } from '../../../../../types/group-id';

type AugmentedWithSortProperty = ReadonlySet<{
  representative: ExpressionDoi,
  lastEvaluationByThisGroupPublishedAt: Date,
}>;

const augmentWithSortProperty = (input: ReadonlySet<ExpressionDoi>): AugmentedWithSortProperty => pipe(
  Array.from(input),
  RA.map((expressionDoi) => ({
    representative: expressionDoi,
    lastEvaluationByThisGroupPublishedAt: new Date(),
  })),
  (arrayAugmentedWithSortProperty) => new Set(arrayAugmentedWithSortProperty),
);

export const constructSortedFeed = (
  dependencies: Dependencies,
  groupId: GroupId,
): ReadonlyArray<ExpressionDoi> => pipe(
  dependencies.getPapersEvaluatedByGroup(groupId),
  augmentWithSortProperty,
  (representatives) => Array.from(representatives),
  RA.map((representativeAugmentedWithSortProperty) => representativeAugmentedWithSortProperty.representative),
);
