import { URL } from 'url';
import { Maybe } from 'true-myth';
import { GetReviews } from './render-feed';
import Doi from '../types/doi';
import EditorialCommunityId from '../types/editorial-community-id';
import { ReviewId } from '../types/review-id';

export type GetReviewIdentifiers= (articleDoi: Doi) => Promise<ReadonlyArray<{reviewId: ReviewId}>>;
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

    if (doi.value === '10.1101/646810') {
      const editorialCommunityId = new EditorialCommunityId('316db7d9-88cc-4c26-b386-f067e0f56334');
      const editorialCommunity = await getEditorialCommunity(editorialCommunityId);

      return Promise.all((await getReviewIdentifiers(doi)).map(async (reviewIdentifiers) => {
        const review = await getReviewDetailsAndSource(reviewIdentifiers.reviewId);
        return {
          sourceUrl: review.source,
          publicationDate: new Date('2020-05-14'),
          editorialCommunityId,
          editorialCommunityName: editorialCommunity.name,
          editorialCommunityAvatar: editorialCommunity.avatar,
          details: review.details,
        };
      }));
    }

    return [];
  }
);
