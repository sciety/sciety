import { ArticleReviewedEvent } from '../types/domain-events';
import ReviewReference from '../types/review-reference';
import ReviewReferenceRepository from '../types/review-reference-repository';

export default (events: ReadonlyArray<ArticleReviewedEvent>): ReviewReferenceRepository => {
  const reviewReferences: Array<ReviewReference> = events.map((event) => ({
    articleVersionDoi: event.articleId,
    reviewId: event.reviewId,
    editorialCommunityId: event.actorId,
    added: event.date,
  }));

  return {
    findReviewsForArticleVersionDoi: async (articleVersionDoi) => (
      reviewReferences
        .filter((reference) => reference.articleVersionDoi.value === articleVersionDoi.value)
    ),

    findReviewsForEditorialCommunityId: async (editorialCommunityId) => (
      reviewReferences
        .filter((reference) => reference.editorialCommunityId.value === editorialCommunityId.value)
    ),
  };
};
