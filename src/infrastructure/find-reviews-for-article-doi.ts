import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
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
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
): FindReviewsForArticleDoi => (articleDoi) => pipe(
  getAllEvents,
  T.map(flow(
    RA.filter(isEditorialCommunityReviewedArticleEvent),
    RA.filter((event) => event.articleId.value === articleDoi.value),
    RA.map((event) => ({
      reviewId: event.reviewId,
      editorialCommunityId: event.editorialCommunityId,
      occurredAt: event.date,
    })),
  )),
);
