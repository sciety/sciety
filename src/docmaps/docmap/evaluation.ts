import { URL } from 'url';
import * as RI from '../../types/evaluation-locator';

export type Evaluation = {
  sourceUrl: URL,
  evaluationLocator: RI.EvaluationLocator,
  recordedAt: Date,
  publishedAt: Date,
  authors: ReadonlyArray<string>,
};
