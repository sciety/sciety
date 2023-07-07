import * as Es from './evaluations';
import { SkippedItem } from './skipped-item';

export type FeedData = {
  evaluations: Es.Evaluations,
  skippedItems: ReadonlyArray<SkippedItem>,
};
