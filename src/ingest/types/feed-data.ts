import * as Es from './evaluations.js';
import { SkippedItem } from './skipped-item.js';

export type FeedData = {
  evaluations: Es.Evaluations,
  skippedItems: ReadonlyArray<SkippedItem>,
};
