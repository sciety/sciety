import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import * as D from 'fp-ts/Date';
import * as Ord from 'fp-ts/Ord';
import { sequenceS } from 'fp-ts/Apply';
import { ExpressionPublishedFeedItem, FeedItem } from '../view-model';
import { Dependencies } from './dependencies';
import { PaperExpression } from '../../../types/paper-expression';
import * as PH from '../../../types/publishing-history';
import { constructEvaluationHistory } from '../../../read-side/construct-evaluation-history';
import { evaluationToFeedItem } from './evaluation-to-feed-item';

const byDate: Ord.Ord<FeedItem> = pipe(
  D.Ord,
  Ord.contramap((event) => event.publishedAt),
);

const byDateDescending: Ord.Ord<FeedItem> = pipe(
  byDate,
  Ord.reverse,
);

const toPaperExpressionEvent = (paperExpression: PaperExpression): ExpressionPublishedFeedItem => ({
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
      constructEvaluationHistory(dependencies, history),
      RA.map((evaluation) => ({
        ...evaluation,
        type: 'evaluation-published' as const,
      })),
      T.traverseArray((evaluation) => evaluationToFeedItem(dependencies, evaluation)),
    ),
    expressions: pipe(
      history,
      PH.getAllExpressions,
      RA.map(toPaperExpressionEvent),
      T.of,
    ),
  }),
  sequenceS(T.ApplyPar),
  T.map((feeds) => [...feeds.evaluations, ...feeds.expressions]),
  T.map(RA.sort(byDateDescending)),
);
