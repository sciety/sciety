import * as O from 'fp-ts/Option';
import { ArticleId } from './article-id';
import { GroupId } from './group-id';
import { EvaluationLocator } from './evaluation-locator';

export const evaluationTypes = <const> [
  'review',
  'author-response',
  'curation-statement',
  'not-provided',
];

export type EvaluationType = typeof evaluationTypes[number];

export type RecordedEvaluation = {
  articleId: ArticleId,
  evaluationLocator: EvaluationLocator,
  groupId: GroupId,
  recordedAt: Date,
  publishedAt: Date,
  authors: ReadonlyArray<string>,
  type: O.Option<EvaluationType>,
};
