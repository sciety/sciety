import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { ExpressionPublishedFeedItem, FeedItem } from '../view-model';
import { EvaluationEvent, evaluationToFeedItem } from './evaluation-to-feed-item';
import { Dependencies } from './dependencies';

export type FeedEvent = EvaluationEvent | ExpressionPublishedFeedItem;

type GetFeedEventsContent = (dependencies: Dependencies)
=> (feedEvents: ReadonlyArray<FeedEvent>)
=> T.Task<ReadonlyArray<FeedItem>>;

export const getFeedEventsContent: GetFeedEventsContent = (dependencies) => (feedEvents) => {
  const toFeedItem = (feedEvent: FeedEvent): T.Task<FeedItem> => {
    switch (feedEvent.type) {
      case 'expression-published':
        return T.of(feedEvent);
      case 'evaluation-published':
        return evaluationToFeedItem(dependencies, feedEvent);
    }
  };
  return pipe(
    feedEvents,
    T.traverseArray(toFeedItem),
  );
};
