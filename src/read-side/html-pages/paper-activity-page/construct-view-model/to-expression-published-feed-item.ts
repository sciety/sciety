import { PaperExpression } from '../../../../types/paper-expression';
import { ExpressionPublishedFeedItem } from '../view-model';

export const toExpressionPublishedFeedItem = (paperExpression: PaperExpression): ExpressionPublishedFeedItem => ({
  type: 'expression-published' as const,
  ...paperExpression,
  source: paperExpression.publisherHtmlUrl,
  doi: paperExpression.expressionDoi,
});
