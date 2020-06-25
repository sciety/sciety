import { FetchReview } from '../api/fetch-review';
import Doi from '../data/doi';
import createLogger from '../logger';
import EditorialCommunityRepository from '../types/editorial-community-repository';
import ReviewReferenceRepository from '../types/review-reference-repository';

interface FetchedReview {
  publicationDate: Date;
  summary: string;
  editorialCommunityId: string;
}

interface Review {
  publicationDate: Date;
  summary: string;
  url: URL;
  editorialCommunityId: string;
  editorialCommunityName: string;
}

type GetReviews = (doi: Doi) => Promise<Array<Review>>;

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
          if (!(reviewReference.reviewId instanceof Doi)) {
            throw new Error(`${reviewReference.reviewId} is not a DOI`);
          }

          const fetchedReview = await fetchReview(reviewReference.reviewId);

          return {
            url: new URL(`https://doi.org/${reviewReference.reviewId.value}`),
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
        editorialCommunityName: editorialCommunity ? editorialCommunity.name : 'Unknown',
      };
    });
  };
};
