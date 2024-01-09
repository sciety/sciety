import { URL } from 'url';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { ArticleServer } from '../../../types/article-server';
import { FeedItem } from '../view-model';
import { EvaluationEvent, evaluationToFeedItem } from './evaluation-to-feed-item';
import { Dependencies } from './dependencies';
import { ExpressionDoi } from '../../../types/expression-doi';

export type PaperExpressionEvent = {
  type: 'paper-expression',
  source: URL,
  publishedAt: Date,
  doi: ExpressionDoi,
};

export type FeedEvent = EvaluationEvent | PaperExpressionEvent;

const paperExpressionToFeedItem = (
  server: ArticleServer,
  feedEvent: PaperExpressionEvent,
) => (
  T.of({ ...feedEvent, server: O.some(server) })
);

type GetFeedEventsContent = (dependencies: Dependencies, server: ArticleServer)
=> (feedEvents: ReadonlyArray<FeedEvent>)
=> T.Task<ReadonlyArray<FeedItem>>;

export const getFeedEventsContent: GetFeedEventsContent = (dependencies, server) => (feedEvents) => {
  const toFeedItem = (feedEvent: FeedEvent): T.Task<FeedItem> => {
    switch (feedEvent.type) {
      case 'paper-expression':
        return paperExpressionToFeedItem(server, feedEvent);
      case 'evaluation':
        return evaluationToFeedItem(dependencies, feedEvent);
    }
  };
  return pipe(
    feedEvents,
    T.traverseArray(toFeedItem),
  );
};
