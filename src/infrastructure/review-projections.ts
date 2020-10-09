import Doi from '../types/doi';
import { EditorialCommunityReviewedArticleEvent } from '../types/domain-events';
import EditorialCommunityId from '../types/editorial-community-id';
import { ReviewId } from '../types/review-id';

export type FindReviewsForArticleDoi = (articleDoi: Doi) => Promise<ReadonlyArray<{
  reviewId: ReviewId;
  editorialCommunityId: EditorialCommunityId;
  occurredAt: Date;
}>>;

export type FindReviewsForEditorialCommunityId = (editorialCommunityId: EditorialCommunityId) => Promise<Array<{
  articleDoi: Doi;
  reviewId: ReviewId;
  added: Date;
}>>;

interface ReviewProjections {
  findReviewsForArticleDoi: FindReviewsForArticleDoi;
  findReviewsForEditorialCommunityId: FindReviewsForEditorialCommunityId;
}

export default (events: ReadonlyArray<EditorialCommunityReviewedArticleEvent>): ReviewProjections => ({
  findReviewsForArticleDoi: async (articleDoi) => (
    events
      .filter((event) => event.articleId.value === articleDoi.value)
      .map((event) => ({
        reviewId: event.reviewId,
        editorialCommunityId: event.editorialCommunityId,
        occurredAt: event.date,
      }))
  ),

  findReviewsForEditorialCommunityId: async (editorialCommunityId) => (
    events
      .filter((event) => event.editorialCommunityId.value === editorialCommunityId.value)
      .map((event) => ({
        articleDoi: event.articleId,
        reviewId: event.reviewId,
        added: event.date,
      }))
  ),
});
