import { URL } from 'url';
import * as T from 'fp-ts/lib/Task';
import { Maybe } from 'true-myth';
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

type FeedEvent = ReviewEvent | ArticleVersionEvent;

export type GetFeedEvents = (articleDoi: Doi) => Promise<ReadonlyArray<FeedEvent>>;

export type GetReview = (id: ReviewId) => T.Task<{
  fullText: Maybe<HtmlFragment>;
  url: URL;
}>;

export type GetEditorialCommunity = (id: EditorialCommunityId) => Promise<{ name: string, avatar: URL }>;

export default (
  getFeedEvents: GetFeedEvents,
  getReview: GetReview,
  getEditorialCommunity: GetEditorialCommunity,
) : GetFeedItems => (
  async (doi) => {
    const feedItems = (await getFeedEvents(doi)).map(
      async (feedEvent): Promise<FeedItem> => {
        if (feedEvent.type === 'article-version') {
          return feedEvent;
        }
        const [editorialCommunity, review] = await Promise.all([
          getEditorialCommunity(feedEvent.editorialCommunityId),
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
          fullText: review.fullText.map(sanitise),
        };
      },
    );

    return Promise.all(feedItems);
  }
);
