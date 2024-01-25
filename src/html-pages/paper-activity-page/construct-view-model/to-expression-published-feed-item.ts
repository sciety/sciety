import { PaperExpression } from '../../../types/paper-expression';
import { ExpressionPublishedFeedItem } from '../view-model';

const buildPublishedTo = (paperExpression: PaperExpression) => paperExpression.expressionDoi;

export const toExpressionPublishedFeedItem = (paperExpression: PaperExpression): ExpressionPublishedFeedItem => ({
  type: 'expression-published' as const,
  ...paperExpression,
  source: paperExpression.publisherHtmlUrl,
  doi: paperExpression.expressionDoi,
  publishedTo: buildPublishedTo(paperExpression),
});
