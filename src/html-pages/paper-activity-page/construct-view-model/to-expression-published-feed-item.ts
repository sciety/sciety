import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { PaperExpression } from '../../../types/paper-expression';
import { ExpressionPublishedFeedItem } from '../view-model';
import { articleServers } from '../../../types/article-server';

const onServer = (server: ExpressionPublishedFeedItem['server']) => pipe(
  server,
  O.match(
    () => '',
    (serverKey) => ` on ${articleServers[serverKey].name}`,
  ),
);

const buildPublishedTo = (paperExpression: PaperExpression) => `${paperExpression.expressionDoi}${onServer(paperExpression.server)}`;

export const toExpressionPublishedFeedItem = (paperExpression: PaperExpression): ExpressionPublishedFeedItem => ({
  type: 'expression-published' as const,
  ...paperExpression,
  source: paperExpression.publisherHtmlUrl,
  doi: paperExpression.expressionDoi,
  publishedTo: buildPublishedTo(paperExpression),
});
