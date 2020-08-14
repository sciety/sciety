import Doi from '../types/doi';
import { ArticleReviewedEvent } from '../types/domain-events';
import EditorialCommunityId from '../types/editorial-community-id';
import { ReviewId } from '../types/review-id';

export type FindReviewsForArticleVersionDoi = (articleVersionDoi: Doi) => Promise<Array<{
  reviewId: ReviewId;
  editorialCommunityId: EditorialCommunityId;
  added: Date;
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

export default (events: ReadonlyArray<ArticleReviewedEvent>): ReviewProjections => ({
  findReviewsForArticleVersionDoi: async (articleVersionDoi) => (
    events
      .filter((event) => event.articleId.value === articleVersionDoi.value)
      .map((event) => ({
        reviewId: event.reviewId,
        editorialCommunityId: event.actorId,
        added: event.date,
      }))
  ),

  findReviewsForEditorialCommunityId: async (editorialCommunityId) => (
    events
      .filter((event) => event.actorId.value === editorialCommunityId.value)
      .map((event) => ({
        articleVersionDoi: event.articleId,
        reviewId: event.reviewId,
        added: event.date,
      }))
  ),
});
