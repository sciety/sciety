import { PaperExpression } from '../../../types/paper-expression.js';
import { ExpressionPublishedFeedItem } from '../view-model.js';

export const toExpressionPublishedFeedItem = (paperExpression: PaperExpression): ExpressionPublishedFeedItem => ({
  type: 'expression-published' as const,
  ...paperExpression,
  source: paperExpression.publisherHtmlUrl,
  doi: paperExpression.expressionDoi,
});
