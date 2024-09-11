import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';
import { ExpressionDoi } from '../../types/expression-doi';
import { GroupId } from '../../types/group-id';

export type EvaluatedPaper = {
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

export const getPapersEvaluatedByGroup = (
  readModel: ReadModel,
) => (
  groupId: GroupId,
): ReadonlySet<EvaluatedPaper> => pipe(
  readModel.paperSnapshotRepresentatives,
  R.lookup(groupId),
  O.map((setOfExpressionDois) => augmentWithSortProperty(setOfExpressionDois)),
  O.getOrElseW(() => new Set<EvaluatedPaper>()),
);
