import { URL } from 'url';
import * as EL from '../../../../types/evaluation-locator';

export type Action = {
  webPageOriginalUrl: URL,
  // @deprecated not part of an action property of a docmap, replace with a `webPageScietyUrl` on this type
  evaluationLocator: EL.EvaluationLocator,
  // @deprecated not part of an action property of a docmap, introduce a `created` property on the DocmapViewModel
  recordedAt: Date,
  publishedAt: Date,
  participants: ReadonlyArray<string>,
  webContentUrl: URL,
  // @deprecated not part of an action property of a docmap, other code depends on it
  updatedAt: Date,
};
