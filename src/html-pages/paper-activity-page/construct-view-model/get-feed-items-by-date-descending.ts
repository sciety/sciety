import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import * as D from 'fp-ts/Date';
import * as Ord from 'fp-ts/Ord';
import { sequenceS } from 'fp-ts/Apply';
import { FeedItem } from '../view-model';
import { Dependencies } from './dependencies';
import * as PH from '../../../types/publishing-history';
import { constructEvaluationHistory } from '../../../read-side/construct-evaluation-history';
import { toEvaluationPublishedFeedItem } from './to-evaluation-published-feed-item';
import { toExpressionPublishedFeedItem } from './to-expression-published-feed-item';

const byDate: Ord.Ord<FeedItem> = pipe(
  D.Ord,
  Ord.contramap((event) => event.publishedAt),
);

const byDateDescending: Ord.Ord<FeedItem> = pipe(
  byDate,
  Ord.reverse,
);

type GetFeedItemsByDateDescending = (dependencies: Dependencies)
=> (history: PH.PublishingHistory)
=> T.Task<ReadonlyArray<FeedItem>>;

export const getFeedItemsByDateDescending: GetFeedItemsByDateDescending = (
  dependencies,
) => (
  history,
) => pipe(
  ({
    evaluations: pipe(
      constructEvaluationHistory(dependencies, history),
      T.traverseArray(toEvaluationPublishedFeedItem(dependencies)),
    ),
    expressions: pipe(
      history,
      PH.getAllExpressions,
      RA.map(toExpressionPublishedFeedItem),
      T.of,
    ),
  }),
  sequenceS(T.ApplyPar),
  T.map((items) => [...items.evaluations, ...items.expressions]),
  T.map(RA.sort(byDateDescending)),
);
