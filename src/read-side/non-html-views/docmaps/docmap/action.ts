import { URL } from 'url';
import * as EL from '../../../../types/evaluation-locator';

export type Action = {
  sourceUrl: URL,
  evaluationLocator: EL.EvaluationLocator,
  recordedAt: Date,
  publishedAt: Date,
  authors: ReadonlyArray<string>,
  webContentUrl: URL,
};
