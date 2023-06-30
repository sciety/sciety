import * as O from 'fp-ts/Option';
import { arbitraryGroupId } from './group-id.helper';
import { arbitraryDate, arbitraryNumber, arbitraryString } from '../helpers';
import { evaluationTypes, RecordedEvaluation } from '../../src/types/recorded-evaluation';
import { arbitraryArticleId } from './article-id.helper';
import { arbitraryEvaluationLocator } from './evaluation-locator.helper';

export const arbitraryRecordedEvaluation = (): RecordedEvaluation => ({
  articleId: arbitraryArticleId(),
  groupId: arbitraryGroupId(),
  reviewId: arbitraryEvaluationLocator(),
  publishedAt: arbitraryDate(),
  authors: [arbitraryString()],
  recordedAt: arbitraryDate(),
  type: O.some(evaluationTypes[arbitraryNumber(0, evaluationTypes.length - 1)]),
});
