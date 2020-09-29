import { URL } from 'url';
import { Maybe } from 'true-myth';
import { GetReviews } from './render-feed';
import Doi from '../types/doi';
import EditorialCommunityId from '../types/editorial-community-id';
import { ReviewId } from '../types/review-id';

export type GetReviewIdentifiers = (articleDoi: Doi) => Promise<ReadonlyArray<{
  editorialCommunityId: EditorialCommunityId;
  reviewId: ReviewId;
}>>;
type GetReview = (id: ReviewId) => Promise<{
  summary: Maybe<string>;
  url: URL;
}>;
export type GetEditorialCommunity = (id: EditorialCommunityId) => Promise<{ name: string, avatar: URL }>;

export default (
  getReviewIdentifiers: GetReviewIdentifiers,
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

    return Promise.all((await getReviewIdentifiers(doi)).map(async (reviewIdentifiers) => {
      const [editorialCommunity, review] = await Promise.all([
        getEditorialCommunity(reviewIdentifiers.editorialCommunityId),
        getReviewDetailsAndSource(reviewIdentifiers.reviewId),
      ]);

      return {
        sourceUrl: review.source,
        publicationDate: new Date('2020-05-14'),
        editorialCommunityId: reviewIdentifiers.editorialCommunityId,
        editorialCommunityName: editorialCommunity.name,
        editorialCommunityAvatar: editorialCommunity.avatar,
        details: review.details,
      };
    }));
  }
);
