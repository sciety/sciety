import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import { DomainEvent, isEditorialCommunityReviewedArticleEvent } from '../domain-events';
import { Doi, eqDoi } from '../types/doi';
import { GroupId } from '../types/group-id';
import { ReviewId } from '../types/review-id';

type FindReviewsForArticleDoi = (getAllEvents: GetAllEvents) => (articleDoi: Doi) => T.Task<ReadonlyArray<{
  reviewId: ReviewId,
  groupId: GroupId,
  occurredAt: Date,
}>>;

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

export const findReviewsForArticleDoi: FindReviewsForArticleDoi = (getAllEvents) => (articleDoi) => pipe(
  getAllEvents,
  T.map(flow(
    RA.filter(isEditorialCommunityReviewedArticleEvent),
    RA.filter((event) => eqDoi.equals(event.articleId, articleDoi)),
    RA.map((event) => ({
      reviewId: event.reviewId,
      groupId: event.editorialCommunityId,
      occurredAt: event.date,
    })),
  )),
);
