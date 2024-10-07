import * as D from 'fp-ts/Date';
import * as O from 'fp-ts/Option';
import * as Ord from 'fp-ts/Ord';
import { pipe } from 'fp-ts/function';
import { EvaluationType } from '../../domain-events/types/evaluation-type';
import { EvaluationLocator } from '../../types/evaluation-locator';
import { ExpressionDoi } from '../../types/expression-doi';
import { GroupId } from '../../types/group-id';

export type RecordedEvaluation = {
  expressionDoi: ExpressionDoi,
  evaluationLocator: EvaluationLocator,
  groupId: GroupId,
  recordedAt: Date,
  publishedAt: Date,
  updatedAt: Date,
  authors: ReadonlyArray<string>,
  type: O.Option<EvaluationType>,
};

export const byMostRecentlyPublished: Ord.Ord<RecordedEvaluation> = pipe(
  D.Ord,
  Ord.reverse,
  Ord.contramap((entry) => entry.publishedAt),
);

export const isCurationStatement = (
  recordedEvaluation: RecordedEvaluation,
): boolean => {
  if (O.isNone(recordedEvaluation.type)) {
    return false;
  }
  return recordedEvaluation.type.value === 'curation-statement';
};
