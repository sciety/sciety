import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import * as D from 'fp-ts/Date';
import * as Ord from 'fp-ts/Ord';
import { PaperExpressionEvent, FeedEvent, getFeedEventsContent } from './get-feed-events-content';
import { FeedItem } from '../view-model';
import { Dependencies } from './dependencies';
import { PaperExpression } from '../../../types/paper-expression';
import * as PH from '../../../types/publishing-history';

const byDate: Ord.Ord<FeedEvent> = pipe(
  D.Ord,
  Ord.contramap((event) => event.publishedAt),
);

const byDateDescending: Ord.Ord<FeedEvent> = pipe(
  byDate,
  Ord.reverse,
);

const toPaperExpressionEvent = (paperExpression: PaperExpression): PaperExpressionEvent => ({
  type: 'expression-published' as const,
  ...paperExpression,
  source: paperExpression.publisherHtmlUrl,
  doi: paperExpression.expressionDoi,
});

type GetArticleFeedEventsByDateDescending = (dependencies: Dependencies)
=> (history: PH.PublishingHistory)
=> T.Task<ReadonlyArray<FeedItem>>;

export const getArticleFeedEventsByDateDescending: GetArticleFeedEventsByDateDescending = (
  dependencies,
) => (
  history,
) => pipe(
  ({
    evaluations: pipe(
      history,
      PH.getAllExpressionDois,
      dependencies.getEvaluationsOfMultipleExpressions,
      RA.map((evaluation) => ({
        ...evaluation,
        type: 'evaluation-published' as const,
      })),
    ),
    expressions: pipe(
      history,
      PH.getAllExpressions,
      RA.map(toPaperExpressionEvent),
    ),
  }),
  (feeds) => [...feeds.evaluations, ...feeds.expressions],
  RA.sort(byDateDescending),
  getFeedEventsContent(dependencies),
);
