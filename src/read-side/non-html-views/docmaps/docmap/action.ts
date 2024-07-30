import { URL } from 'url';
import * as EL from '../../../../types/evaluation-locator';

export type Action = {
  webPageOriginalUrl: URL,
  evaluationLocator: EL.EvaluationLocator,
  recordedAt: Date,
  publishedAt: Date,
  authors: ReadonlyArray<string>,
  webContentUrl: URL,
  // @deprecated not part of an action property of a docmap, other code depends on it
  updatedAt: Date,
};
