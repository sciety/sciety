import * as T from 'fp-ts/lib/Task';
import Doi from '../types/doi';
import { EditorialCommunityReviewedArticleEvent } from '../types/domain-events';
import EditorialCommunityId from '../types/editorial-community-id';
import { ReviewId } from '../types/review-id';

export type FindReviewsForArticleDoi = (articleDoi: Doi) => T.Task<ReadonlyArray<{
  reviewId: ReviewId;
  editorialCommunityId: EditorialCommunityId;
  occurredAt: Date;
}>>;

interface ReviewProjections {
  findReviewsForArticleDoi: FindReviewsForArticleDoi;
}

export default (events: ReadonlyArray<EditorialCommunityReviewedArticleEvent>): ReviewProjections => ({
  findReviewsForArticleDoi: (articleDoi) => T.of(
    events
      .filter((event) => event.articleId.value === articleDoi.value)
      .map((event) => ({
        reviewId: event.reviewId,
        editorialCommunityId: event.editorialCommunityId,
        occurredAt: event.date,
      })),
  ),
});
