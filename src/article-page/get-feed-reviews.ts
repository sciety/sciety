import { URL } from 'url';
import { Maybe } from 'true-myth';
import { GetReviews } from './render-feed';
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
    const getReviewFullTextAndSource = async (
      reviewId: ReviewId,
    ): Promise<{
      fullText: Maybe<string>,
      source: URL,
    }> => {
      const review = await getReview(reviewId);
      return {
        fullText: review.fullText,
        source: review.url,
      };
    };

    return Promise.all((await getFeedEvents(doi)).map(async (feedEvent) => {
      const [editorialCommunity, review] = await Promise.all([
        getEditorialCommunity(feedEvent.editorialCommunityId),
        getReviewFullTextAndSource(feedEvent.reviewId),
      ]);

      return {
        source: review.source,
        occurredAt: feedEvent.occurredAt,
        editorialCommunityId: feedEvent.editorialCommunityId,
        editorialCommunityName: editorialCommunity.name,
        editorialCommunityAvatar: editorialCommunity.avatar,
        fullText: review.fullText,
      };
    }));
  }
);
