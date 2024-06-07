import { PublishedEvaluation } from './published-evaluation';
import { SkippedEvaluation } from './skipped-evaluation';

export type DiscoveredPublishedEvaluations = {
  understood: ReadonlyArray<PublishedEvaluation>,
  skipped: ReadonlyArray<SkippedEvaluation>,
};
