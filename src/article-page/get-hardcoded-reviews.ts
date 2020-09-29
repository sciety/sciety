import { URL } from 'url';
import { Maybe } from 'true-myth';
import { GetReviews } from './render-feed';
import Doi from '../types/doi';
import EditorialCommunityId from '../types/editorial-community-id';
import { ReviewId } from '../types/review-id';

export type GetFeedEvents= (articleDoi: Doi) => Promise<ReadonlyArray<{
  editorialCommunityId: EditorialCommunityId;
  reviewId: ReviewId;
  occurredAt: Date;
}>>;
type GetReview = (id: ReviewId) => Promise<{
  summary: Maybe<string>;
  url: URL;
}>;
export type GetEditorialCommunity = (id: EditorialCommunityId) => Promise<{ name: string, avatar: URL }>;

export default (
  getFeedEvents: GetFeedEvents,
  getReview: GetReview,
  getEditorialCommunity: GetEditorialCommunity,
) : GetReviews => (
  async (doi) => {
    const getReviewDetailsAndSource = async (reviewId: ReviewId): Promise<{ details: string, source: URL }> => {
      const review = await getReview(reviewId);
      return {
        details: review.summary.unsafelyUnwrap(),
        source: review.url,
      };
    };

    return Promise.all((await getFeedEvents(doi)).map(async (feedEvent) => {
      const [editorialCommunity, review] = await Promise.all([
        getEditorialCommunity(feedEvent.editorialCommunityId),
        getReviewDetailsAndSource(feedEvent.reviewId),
      ]);

      return {
        sourceUrl: review.source,
        occurredAt: feedEvent.occurredAt,
        editorialCommunityId: feedEvent.editorialCommunityId,
        editorialCommunityName: editorialCommunity.name,
        editorialCommunityAvatar: editorialCommunity.avatar,
        details: review.details,
      };
    }));
  }
);
