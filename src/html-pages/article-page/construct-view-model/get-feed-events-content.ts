import { URL } from 'url';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { ArticleServer } from '../../../types/article-server.js';
import { FeedItem } from '../view-model.js';
import { EvaluationEvent, evaluationToFeedItem } from './evaluation-to-feed-item.js';
import { Dependencies } from './dependencies.js';

type ArticleVersionEvent = {
  type: 'article-version',
  source: URL,
  publishedAt: Date,
  version: number,
};

export type FeedEvent = EvaluationEvent | ArticleVersionEvent;

const articleVersionToFeedItem = (
  server: ArticleServer,
  feedEvent: ArticleVersionEvent,
) => (
  T.of({ ...feedEvent, server })
);

type GetFeedEventsContent = (dependencies: Dependencies, server: ArticleServer)
=> (feedEvents: ReadonlyArray<FeedEvent>)
=> T.Task<ReadonlyArray<FeedItem>>;

export const getFeedEventsContent: GetFeedEventsContent = (dependencies, server) => (feedEvents) => {
  const toFeedItem = (feedEvent: FeedEvent): T.Task<FeedItem> => {
    switch (feedEvent.type) {
      case 'article-version':
        return articleVersionToFeedItem(server, feedEvent);
      case 'evaluation':
        return evaluationToFeedItem(dependencies, feedEvent);
    }
  };
  return pipe(
    feedEvents,
    T.traverseArray(toFeedItem),
  );
};
