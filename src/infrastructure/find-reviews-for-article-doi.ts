import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import { Doi, eqDoi } from '../types/doi';
import { DomainEvent, isEditorialCommunityReviewedArticleEvent } from '../types/domain-events';
import { GroupId } from '../types/group-id';
import { ReviewId } from '../types/review-id';

export type FindReviewsForArticleDoi = (articleDoi: Doi) => T.Task<ReadonlyArray<{
  reviewId: ReviewId,
  editorialCommunityId: GroupId,
  occurredAt: Date,
}>>;

export const findReviewsForArticleDoi = (
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
): FindReviewsForArticleDoi => (articleDoi) => pipe(
  getAllEvents,
  T.map(flow(
    RA.filter(isEditorialCommunityReviewedArticleEvent),
    RA.filter((event) => eqDoi.equals(event.articleId, articleDoi)),
    RA.map((event) => ({
      reviewId: event.reviewId,
      editorialCommunityId: event.editorialCommunityId,
      occurredAt: event.date,
    })),
  )),
);
