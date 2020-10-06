import { URL } from 'url';
import { Maybe } from 'true-myth';
import { GetFeedItems } from './render-feed';
import { ReviewFeedItem } from './render-review-feed-item';
import { ArticleVersionFeedItem } from './render-version-feed-item';
import Doi from '../types/doi';
import EditorialCommunityId from '../types/editorial-community-id';
import { ReviewId } from '../types/review-id';

type ReviewEvent = {
  editorialCommunityId: EditorialCommunityId;
  reviewId: ReviewId;
  occurredAt: Date;
};

type ArticleVersionEvent = {
  source: URL;
  postedAt: Date;
  version: number;
};

const isArticleVersionEvent = (event: ReviewEvent|ArticleVersionEvent):
  event is ArticleVersionEvent => (
  Object.prototype.hasOwnProperty.call(event, 'postedAt')
);

export type GetFeedEvents = (articleDoi: Doi) => Promise<ReadonlyArray<ReviewEvent|ArticleVersionEvent>>;

export type GetReview = (id: ReviewId) => Promise<{
  fullText: Maybe<string>;
  url: URL;
}>;

export type GetEditorialCommunity = (id: EditorialCommunityId) => Promise<{ name: string, avatar: URL }>;

export default (
  getFeedEvents: GetFeedEvents,
  getReview: GetReview,
  getEditorialCommunity: GetEditorialCommunity,
) : GetFeedItems => (
  async (doi) => {
    const feedItems: Array<Promise<ReviewFeedItem|ArticleVersionFeedItem>> = (await getFeedEvents(doi)).map(
      async (feedEvent) => {
        if (isArticleVersionEvent(feedEvent)) {
          return feedEvent;
        }
        const [editorialCommunity, review] = await Promise.all([
          getEditorialCommunity(feedEvent.editorialCommunityId),
          getReview(feedEvent.reviewId),
        ]);

        return {
          source: review.url,
          occurredAt: feedEvent.occurredAt,
          editorialCommunityId: feedEvent.editorialCommunityId,
          editorialCommunityName: editorialCommunity.name,
          editorialCommunityAvatar: editorialCommunity.avatar,
          fullText: review.fullText,
        };
      },
    );

    if (doi.value === '10.1101/646810') {
      feedItems.push(Promise.resolve({
        source: new URL('https://www.biorxiv.org/content/10.1101/646810v1?versioned=true'),
        postedAt: new Date('2019-05-24'),
        version: 1,
      }));
    }
    return Promise.all(feedItems);
  }
);
