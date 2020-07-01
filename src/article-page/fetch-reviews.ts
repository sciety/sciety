import { Maybe } from 'true-myth';
import { GetReviews } from './render-reviews';
import createLogger from '../logger';
import EditorialCommunityRepository from '../types/editorial-community-repository';
import { ReviewId } from '../types/review-id';
import ReviewReferenceRepository from '../types/review-reference-repository';

export type FetchReview = (id: ReviewId) => Promise<{
  publicationDate?: Date;
  summary?: string;
  url: URL;
}>;

export default (
  reviewReferenceRepository: ReviewReferenceRepository,
  fetchReview: FetchReview,
  editorialCommunities: EditorialCommunityRepository,
): GetReviews => {
  const log = createLogger('middleware:fetch-reviews-for-article-page');

  return async (doi) => {
    const reviews = await Promise.all(
      (await reviewReferenceRepository.findReviewsForArticleVersionDoi(doi))
        .map(async (reviewReference) => {
          const fetchedReview = await fetchReview(reviewReference.reviewId);

          return {
            ...reviewReference,
            ...fetchedReview,
          };
        }),
    )
      .catch((error) => {
        log(`Failed to load reviews for article ${doi}: (${error})`);
        throw error;
      });

    return reviews.map((review) => {
      const editorialCommunity = editorialCommunities.lookup(review.editorialCommunityId);
      return {
        ...review,
        summary: Maybe.of(review.summary),
        editorialCommunityName: editorialCommunity ? editorialCommunity.name : 'Unknown',
      };
    });
  };
};
