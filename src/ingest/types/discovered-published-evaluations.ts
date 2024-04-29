import { PublishedEvaluation } from './published-evaluation';
import { SkippedItem } from './skipped-item';

export type DiscoveredPublishedEvaluations = {
  evaluations: ReadonlyArray<PublishedEvaluation>,
  skippedItems: ReadonlyArray<SkippedItem>,
};
