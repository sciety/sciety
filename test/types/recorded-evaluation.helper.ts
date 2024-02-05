import * as O from 'fp-ts/Option';
import { arbitraryGroupId } from './group-id.helper';
import { arbitraryDate, arbitraryString } from '../helpers';
import { RecordedEvaluation } from '../../src/types/recorded-evaluation';
import { arbitraryArticleId, toExpressionDoi } from './article-id.helper';
import { arbitraryEvaluationLocator } from './evaluation-locator.helper';
import { arbitraryEvaluationType } from './evaluation-type.helper';

export const arbitraryRecordedEvaluation = (): RecordedEvaluation => {
  const articleId = arbitraryArticleId();
  return {
    expressionDoi: toExpressionDoi(articleId),
    groupId: arbitraryGroupId(),
    evaluationLocator: arbitraryEvaluationLocator(),
    publishedAt: arbitraryDate(),
    authors: [arbitraryString()],
    recordedAt: arbitraryDate(),
    updatedAt: arbitraryDate(),
    type: O.some(arbitraryEvaluationType()),
  };
};
