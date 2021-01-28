import { URL } from 'url';
import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import { FeedItem, GetFeedItems } from './render-feed';
import { Doi } from '../types/doi';
import { EditorialCommunityId } from '../types/editorial-community-id';
import { HtmlFragment } from '../types/html-fragment';
import { ReviewId } from '../types/review-id';
import { sanitise } from '../types/sanitised-html-fragment';

type ReviewEvent = {
  type: 'review',
  editorialCommunityId: EditorialCommunityId;
  reviewId: ReviewId;
  occurredAt: Date;
};

type ArticleVersionEvent = {
  type: 'article-version',
  source: URL;
  occurredAt: Date;
  version: number;
};

export type FeedEvent = ReviewEvent | ArticleVersionEvent;

export type GetFeedEvents = (articleDoi: Doi) => T.Task<ReadonlyArray<FeedEvent>>;

export type GetReview = (id: ReviewId) => T.Task<{
  fullText: O.Option<HtmlFragment>;
  url: URL;
}>;

export type GetEditorialCommunity = (id: EditorialCommunityId) => T.Task<{ name: string, avatar: URL }>;

export const getFeedEventsContent = (
  getFeedEvents: GetFeedEvents,
  getReview: GetReview,
  getEditorialCommunity: GetEditorialCommunity,
) : GetFeedItems => (
  (doi, server) => async () => {
    const feedItems = (await getFeedEvents(doi)()).map(
      async (feedEvent): Promise<FeedItem> => {
        if (feedEvent.type === 'article-version') {
          return { ...feedEvent, server };
        }
        const [editorialCommunity, review] = await Promise.all([
          getEditorialCommunity(feedEvent.editorialCommunityId)(),
          getReview(feedEvent.reviewId)(),
        ]);

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
      },
    );

    return Promise.all(feedItems);
  }
);
