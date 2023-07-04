import * as O from 'fp-ts/Option';
import { Doi } from './doi';
import { GroupId } from './group-id';
import { EvaluationLocator } from './evaluation-locator';

export const evaluationTypes = <const> ['review', 'author-response', 'curation-statement'];

export type EvaluationType = typeof evaluationTypes[number];

export type RecordedEvaluation = {
  articleId: Doi,
  evaluationLocator: EvaluationLocator,
  groupId: GroupId,
  recordedAt: Date,
  publishedAt: Date,
  authors: ReadonlyArray<string>,
  type: O.Option<EvaluationType>,
};
