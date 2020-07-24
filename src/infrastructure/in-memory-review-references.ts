import { Logger } from './logger';
import Doi from '../types/doi';
import { ReviewId } from '../types/review-id';
import ReviewReference from '../types/review-reference';
import ReviewReferenceRepository from '../types/review-reference-repository';

export default (logger: Logger): ReviewReferenceRepository => {
  const reviewReferences: Array<ReviewReference> = [];

  const reviewReferenceRepository: ReviewReferenceRepository = {
    add: async (articleVersionDoi: Doi, reviewId: ReviewId, editorialCommunityId: string, added: Date) => {
      const reviewReference: ReviewReference = {
        articleVersionDoi,
        reviewId,
        editorialCommunityId,
        added,
      };
      reviewReferences.push(reviewReference);
      logger('info', 'Review reference added', { reviewReference });
    },

    [Symbol.iterator]: () => (
      reviewReferences[Symbol.iterator]()
    ),

    findReviewsForArticleVersionDoi: async (articleVersionDoi) => (
      reviewReferences
        .filter((reference) => reference.articleVersionDoi.value === articleVersionDoi.value)
    ),

    findReviewsForEditorialCommunityId: async (editorialCommunityId) => (
      reviewReferences
        .filter((reference) => reference.editorialCommunityId === editorialCommunityId)
    ),
  };
  return reviewReferenceRepository;
};
