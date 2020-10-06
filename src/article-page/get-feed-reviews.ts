import { URL } from 'url';
import { Maybe } from 'true-myth';
import { GetReviews } from './render-feed';
import { Review } from './render-review-feed-item';
import { ArticleVersionFeedItem } from './render-version-feed-item';
import Doi from '../types/doi';
import EditorialCommunityId from '../types/editorial-community-id';
import { ReviewId } from '../types/review-id';

export type GetFeedEvents = (articleDoi: Doi) => Promise<ReadonlyArray<{
  editorialCommunityId: EditorialCommunityId;
  reviewId: ReviewId;
  occurredAt: Date;
}>>;

export type GetReview = (id: ReviewId) => Promise<{
  fullText: Maybe<string>;
  url: URL;
}>;

export type GetEditorialCommunity = (id: EditorialCommunityId) => Promise<{ name: string, avatar: URL }>;

export default (
  getFeedEvents: GetFeedEvents,
  getReview: GetReview,
  getEditorialCommunity: GetEditorialCommunity,
) : GetReviews => (
  async (doi) => {
    const feedItems: Array<Promise<Review|ArticleVersionFeedItem>> = (await getFeedEvents(doi)).map(
      async (feedEvent) => {
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
