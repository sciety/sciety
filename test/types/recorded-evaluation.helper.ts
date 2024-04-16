import * as O from 'fp-ts/Option';
import { arbitraryArticleId } from './article-id.helper';
import { arbitraryEvaluationLocator } from './evaluation-locator.helper';
import { arbitraryEvaluationType } from './evaluation-type.helper';
import { arbitraryGroupId } from './group-id.helper';
import { toExpressionDoi } from '../../src/types/article-id';
import { RecordedEvaluation } from '../../src/types/recorded-evaluation';
import { arbitraryDate, arbitraryString } from '../helpers';

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
