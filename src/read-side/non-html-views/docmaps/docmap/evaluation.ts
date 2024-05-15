import { URL } from 'url';
import * as EL from '../../../../types/evaluation-locator';

export type Evaluation = {
  sourceUrl: URL,
  evaluationLocator: EL.EvaluationLocator,
  recordedAt: Date,
  publishedAt: Date,
  authors: ReadonlyArray<string>,
};
