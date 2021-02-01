import { URL } from 'url';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { FeedItem, GetFeedItems } from './render-feed';
import { Doi } from '../types/doi';
import { EditorialCommunityId } from '../types/editorial-community-id';
import { HtmlFragment } from '../types/html-fragment';
import { ReviewId } from '../types/review-id';
import { sanitise } from '../types/sanitised-html-fragment';

type ReviewEvent = {
  type: 'review',
  editorialCommunityId: EditorialCommunityId,
  reviewId: ReviewId,
  occurredAt: Date,
};

type ArticleVersionEvent = {
  type: 'article-version',
  source: URL,
  occurredAt: Date,
  version: number,
};

export type FeedEvent = ReviewEvent | ArticleVersionEvent;

export type Feed = (articleDoi: Doi) => T.Task<ReadonlyArray<FeedEvent>>;

export type GetReview = (id: ReviewId) => T.Task<{
  fullText: O.Option<HtmlFragment>,
  url: URL,
}>;

export type GetEditorialCommunity = (id: EditorialCommunityId) => T.Task<{ name: string, avatar: URL }>;

export const getFeedEventsContent = (
  getFeedEvents: Feed,
  getReview: GetReview,
  getEditorialCommunity: GetEditorialCommunity,
) : GetFeedItems => (
  (doi, server) => {
    // TODO: remove Task invocation
    const toFeedItem = (feedEvent: FeedEvent) => async (): Promise<FeedItem> => {
      if (feedEvent.type === 'article-version') {
        return { ...feedEvent, server };
      }
      const editorialCommunity = await getEditorialCommunity(feedEvent.editorialCommunityId)();
      const review = await getReview(feedEvent.reviewId)();

      return {
        type: 'review',
        id: feedEvent.reviewId,
        source: review.url,
        occurredAt: feedEvent.occurredAt,
        editorialCommunityId: feedEvent.editorialCommunityId,
        editorialCommunityName: editorialCommunity.name,
        editorialCommunityAvatar: editorialCommunity.avatar,
        fullText: O.map(sanitise)(review.fullText),
      };
    };
    return pipe(
      doi,
      getFeedEvents,
      T.chain(T.traverseArray(toFeedItem)),
    );
  }
);
