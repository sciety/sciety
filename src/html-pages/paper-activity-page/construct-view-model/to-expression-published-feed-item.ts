import { PaperExpression } from '../../../types/paper-expression';
import { ExpressionPublishedFeedItem } from '../view-model';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const buildPublishedTo = (paperExpression: PaperExpression) => '';

export const toExpressionPublishedFeedItem = (paperExpression: PaperExpression): ExpressionPublishedFeedItem => ({
  type: 'expression-published' as const,
  ...paperExpression,
  source: paperExpression.publisherHtmlUrl,
  doi: paperExpression.expressionDoi,
  publishedTo: buildPublishedTo(paperExpression),
});
