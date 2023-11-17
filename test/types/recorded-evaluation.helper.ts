import * as O from 'fp-ts/Option';
import { arbitraryGroupId } from './group-id.helper.js';
import { arbitraryDate, arbitraryString } from '../helpers.js';
import { RecordedEvaluation } from '../../src/types/recorded-evaluation.js';
import { arbitraryArticleId } from './article-id.helper.js';
import { arbitraryEvaluationLocator } from './evaluation-locator.helper.js';
import { arbitraryEvaluationType } from './evaluation-type.helper.js';

export const arbitraryRecordedEvaluation = (): RecordedEvaluation => ({
  articleId: arbitraryArticleId(),
  groupId: arbitraryGroupId(),
  evaluationLocator: arbitraryEvaluationLocator(),
  publishedAt: arbitraryDate(),
  authors: [arbitraryString()],
  recordedAt: arbitraryDate(),
  updatedAt: arbitraryDate(),
  type: O.some(arbitraryEvaluationType()),
});
