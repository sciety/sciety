import * as T from 'fp-ts/Task';
import { Doi } from '../types/doi';
import { DomainEvent, isEditorialCommunityReviewedArticleEvent } from '../types/domain-events';
import { EditorialCommunityId } from '../types/editorial-community-id';
import { ReviewId } from '../types/review-id';

export type FindReviewsForArticleDoi = (articleDoi: Doi) => T.Task<ReadonlyArray<{
  reviewId: ReviewId,
  editorialCommunityId: EditorialCommunityId,
  occurredAt: Date,
}>>;

export const findReviewsForArticleDoi = (
  events: ReadonlyArray<DomainEvent>,
): FindReviewsForArticleDoi => (articleDoi) => T.of(
  events
    .filter(isEditorialCommunityReviewedArticleEvent)
    .filter((event) => event.articleId.value === articleDoi.value)
    .map((event) => ({
      reviewId: event.reviewId,
      editorialCommunityId: event.editorialCommunityId,
      occurredAt: event.date,
    })),
);
