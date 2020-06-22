import { GetReviews, Review } from './middleware/fetch-reviews-for-article-page';
import { FetchReview } from '../api/fetch-review';
import Doi from '../data/doi';
import createLogger from '../logger';
import EditorialCommunityRepository from '../types/editorial-community-repository';
import ReviewReferenceRepository from '../types/review-reference-repository';

interface FetchedReview {
  publicationDate: Date;
  summary: string;
  doi: Doi;
  editorialCommunityId: string;
}

export default (
  reviewReferenceRepository: ReviewReferenceRepository,
  fetchReview: FetchReview,
  editorialCommunities: EditorialCommunityRepository,
): GetReviews => {
  const log = createLogger('middleware:fetch-reviews-for-article-page');

  return async (doi: Doi): Promise<Array<Review>> => {
    const reviews = await Promise.all(
      (await reviewReferenceRepository.findReviewsForArticleVersionDoi(doi))
        .map(async (reviewReference) => {
          const fetchedReview = await fetchReview(reviewReference.reviewDoi);

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

    return reviews.map((review: FetchedReview) => {
      const editorialCommunity = editorialCommunities.lookup(review.editorialCommunityId);
      return {
        ...review,
        editorialCommunityName: editorialCommunity ? editorialCommunity.name : 'Unknown',
      };
    });
  };
};
