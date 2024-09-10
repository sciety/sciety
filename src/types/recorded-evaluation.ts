import * as O from 'fp-ts/Option';
import { EvaluationLocator } from './evaluation-locator';
import { EvaluationType } from './evaluation-type';
import { ExpressionDoi } from './expression-doi';
import { GroupId } from './group-id';

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
