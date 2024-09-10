import * as O from 'fp-ts/Option';
import { EvaluationLocator } from '../../types/evaluation-locator';
import { EvaluationType } from '../../types/evaluation-type';
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
