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
  type: 'expression-published',
  source: URL,
  publishedAt: Date,
  doi: ExpressionDoi,
  server: O.Option<ArticleServer>,
};

export type FeedEvent = EvaluationEvent | PaperExpressionEvent;

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
