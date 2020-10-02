import Doi from '../types/doi';
import { EditorialCommunityReviewedArticleEvent } from '../types/domain-events';
import EditorialCommunityId from '../types/editorial-community-id';
import { ReviewId } from '../types/review-id';

export type FindReviewsForArticleVersionDoi = (articleVersionDoi: Doi) => Promise<ReadonlyArray<{
  reviewId: ReviewId;
  editorialCommunityId: EditorialCommunityId;
  added: Date;
  occurredAt: Date;
}>>;

export type FindReviewsForEditorialCommunityId = (editorialCommunityId: EditorialCommunityId) => Promise<Array<{
  articleVersionDoi: Doi;
  reviewId: ReviewId;
  added: Date;
}>>;

interface ReviewProjections {
  findReviewsForArticleVersionDoi: FindReviewsForArticleVersionDoi;
  findReviewsForEditorialCommunityId: FindReviewsForEditorialCommunityId;
}

export default (events: ReadonlyArray<EditorialCommunityReviewedArticleEvent>): ReviewProjections => ({
  findReviewsForArticleVersionDoi: async (articleVersionDoi) => (
    events
      .filter((event) => event.articleId.value === articleVersionDoi.value)
      .map((event) => ({
        reviewId: event.reviewId,
        editorialCommunityId: event.editorialCommunityId,
        added: event.date,
        occurredAt: event.date,
      }))
  ),

  findReviewsForEditorialCommunityId: async (editorialCommunityId) => (
    events
      .filter((event) => event.editorialCommunityId.value === editorialCommunityId.value)
      .map((event) => ({
        articleVersionDoi: event.articleId,
        reviewId: event.reviewId,
        added: event.date,
      }))
  ),
});
