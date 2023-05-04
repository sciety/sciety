import { arbitraryGroupId } from './group-id.helper';
import { arbitraryDate, arbitraryString } from '../helpers';
import { RecordedEvaluation } from '../../src/types/recorded-evaluation';
import { arbitraryArticleId } from './article-id.helper';
import { arbitraryEvaluationLocator } from './evaluation-locator.helper';

export const arbitraryRecordedEvaluation = (): RecordedEvaluation => ({
  articleId: arbitraryArticleId(),
  groupId: arbitraryGroupId(),
  reviewId: arbitraryEvaluationLocator(),
  publishedAt: arbitraryDate(),
  authors: [arbitraryString()],
  recordedAt: arbitraryDate(),
});
