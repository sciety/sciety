import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import * as D from 'fp-ts/Date';
import * as Ord from 'fp-ts/Ord';
import { PaperExpressionEvent, FeedEvent, getFeedEventsContent } from './get-feed-events-content';
import { ArticleServer } from '../../../types/article-server';
import { FeedItem } from '../view-model';
import { Dependencies } from './dependencies';
import { PaperExpression } from '../../../types/paper-expression';

const byDate: Ord.Ord<FeedEvent> = pipe(
  D.Ord,
  Ord.contramap((event) => event.publishedAt),
);

const byDateDescending: Ord.Ord<FeedEvent> = pipe(
  byDate,
  Ord.reverse,
);

type GetArticleFeedEventsByDateDescending = (dependencies: Dependencies)
=> (server: ArticleServer, foundExpressions: ReadonlyArray<PaperExpression>)
=> T.Task<ReadonlyArray<FeedItem>>;

const toPaperExpressionEvent = (paperExpression: PaperExpression): PaperExpressionEvent => ({
  type: 'expression-published' as const,
  ...paperExpression,
  source: paperExpression.publisherHtmlUrl,
  doi: paperExpression.expressionDoi,
});

export const getArticleFeedEventsByDateDescending: GetArticleFeedEventsByDateDescending = (
  dependencies,
) => (
  server, foundExpressions,
) => pipe(
  ({
    evaluations: pipe(
      foundExpressions,
      RA.map((expression) => expression.expressionDoi),
      dependencies.getEvaluationsOfMultipleExpressions,
      RA.map((evaluation) => ({
        ...evaluation,
        type: 'evaluation-published' as const,
      })),
    ),
    expressions: pipe(
      foundExpressions,
      RA.map(toPaperExpressionEvent),
    ),
  }),
  (feeds) => [...feeds.evaluations, ...feeds.expressions],
  RA.sort(byDateDescending),
  getFeedEventsContent(dependencies),
);
