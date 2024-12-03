import { sequenceS } from 'fp-ts/Apply';
import * as D from 'fp-ts/Date';
import * as Ord from 'fp-ts/Ord';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import { toEvaluationPublishedFeedItem } from './to-evaluation-published-feed-item';
import { toExpressionPublishedFeedItem } from './to-expression-published-feed-item';
import * as EDOI from '../../../../types/expression-doi';
import * as PH from '../../../../types/publishing-history';
import { constructEvaluationHistory } from '../../../construct-evaluation-history';
import { CassyniSeminarPublishedFeedItem, FeedItem } from '../view-model';

const byDate: Ord.Ord<FeedItem> = pipe(
  D.Ord,
  Ord.contramap((event) => event.publishedAt),
);

const byDateDescending: Ord.Ord<FeedItem> = pipe(
  byDate,
  Ord.reverse,
);

const constructCassyniSeminarFeedItems = (
  history: PH.PublishingHistory,
): ReadonlyArray<CassyniSeminarPublishedFeedItem> => {
  if (PH.getAllExpressionDois(history).includes(EDOI.fromValidatedString('10.46471/gigabyte.137'))) {
    return [{
      type: 'cassyni-seminar-published',
      publishedAt: new Date('2024-10-24'),
    }];
  }
  return [];
};

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
  T.map((items) => [...items.evaluations, ...items.expressions, ...constructCassyniSeminarFeedItems(history)]),
  T.map(RA.sort(byDateDescending)),
);
