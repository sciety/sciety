import { Logger } from './logger';
import { ArticleReviewedEvent } from '../types/domain-events';
import ReviewReference from '../types/review-reference';
import ReviewReferenceRepository from '../types/review-reference-repository';

export default (events: ReadonlyArray<ArticleReviewedEvent>, logger: Logger): ReviewReferenceRepository => {
  const reviewReferences: Array<ReviewReference> = events.map((event) => ({
    articleVersionDoi: event.articleId,
    reviewId: event.reviewId,
    editorialCommunityId: event.actorId,
    added: event.date,
  }));

  const reviewReferenceRepository: ReviewReferenceRepository = {
    add: async (articleVersionDoi, reviewId, editorialCommunityId, added) => {
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
        .filter((reference) => reference.editorialCommunityId.value === editorialCommunityId.value)
    ),
  };
  return reviewReferenceRepository;
};
