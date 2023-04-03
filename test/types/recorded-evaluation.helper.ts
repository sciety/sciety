import { arbitraryGroupId } from './group-id.helper';
import { arbitraryDate, arbitraryString } from '../helpers';
import { RecordedEvaluation } from '../../src/types/recorded-evaluation';
import { arbitraryArticleId } from './article-id.helper';
import { arbitraryReviewId } from './review-id.helper';

export const arbitraryRecordedEvaluation = (): RecordedEvaluation => ({
  articleId: arbitraryArticleId(),
  groupId: arbitraryGroupId(),
  reviewId: arbitraryReviewId(),
  publishedAt: arbitraryDate(),
  authors: [arbitraryString()],
  recordedAt: arbitraryDate(),
});
