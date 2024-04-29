import { PublishedEvaluation } from './published-evaluation';
import { SkippedItem } from './skipped-item';

export type FeedData = {
  evaluations: ReadonlyArray<PublishedEvaluation>,
  skippedItems: ReadonlyArray<SkippedItem>,
};
