import * as O from 'fp-ts/Option';
import { EvaluationLocator } from './evaluation-locator';
import { ExpressionDoi } from './expression-doi';
import { GroupId } from './group-id';

export const evaluationTypes = <const> [
  'review',
  'author-response',
  'curation-statement',
  'not-provided',
];

export type EvaluationType = typeof evaluationTypes[number];

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
