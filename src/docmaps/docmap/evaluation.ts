import { URL } from 'url';
import * as RI from '../../types/review-id';

export type Evaluation = {
  sourceUrl: URL,
  reviewId: RI.ReviewId,
  occurredAt: Date,
  authors: ReadonlyArray<string>,
};
