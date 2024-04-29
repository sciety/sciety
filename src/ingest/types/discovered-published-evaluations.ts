import { PublishedEvaluation } from './published-evaluation';
import { SkippedItem } from './skipped-item';

export type DiscoveredPublishedEvaluations = {
  understood: ReadonlyArray<PublishedEvaluation>,
  skipped: ReadonlyArray<SkippedItem>,
};
