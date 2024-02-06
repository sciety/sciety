import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { PaperExpression } from '../../../types/paper-expression';
import { ExpressionPublishedFeedItem } from '../view-model';
import { articleServers } from '../../../types/article-server';
import { isColdSpringHarborServer } from '../../../types/cold-spring-harbor-server';

const onServer = (server: ExpressionPublishedFeedItem['server']) => pipe(
  server,
  O.match(
    () => '',
    (serverKey) => ` on ${articleServers[serverKey].name}`,
  ),
);

const buildPublishedToLocation = (expression: PaperExpression) => pipe(
  expression.server,
  O.map((server) => pipe(
    server,
    isColdSpringHarborServer,
    B.fold(
      () => `${expression.expressionDoi}`,
      () => `${expression.publisherHtmlUrl.toString().replace(/^(.*?)(10\.1101)/, '$2')}`,
    ),
  )),
  O.getOrElse(() => `${expression.expressionDoi}`),
);

const buildPublishedTo = (paperExpression: PaperExpression) => `${buildPublishedToLocation(paperExpression)}${onServer(paperExpression.server)}`;

export const toExpressionPublishedFeedItem = (paperExpression: PaperExpression): ExpressionPublishedFeedItem => ({
  type: 'expression-published' as const,
  ...paperExpression,
  source: paperExpression.publisherHtmlUrl,
  doi: paperExpression.expressionDoi,
  publishedTo: buildPublishedTo(paperExpression),
});
