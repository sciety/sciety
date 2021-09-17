import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import { DomainEvent, isGroupEvaluatedArticleEvent } from '../domain-events';
import { Doi, eqDoi } from '../types/doi';
import { GroupId } from '../types/group-id';
import { ReviewId } from '../types/review-id';

export type FindReviewsForArticleDoi = (articleDoi: Doi) => T.Task<ReadonlyArray<{
  reviewId: ReviewId,
  groupId: GroupId,
  occurredAt: Date,
}>>;

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

export const findReviewsForArticleDoi = (getAllEvents: GetAllEvents): FindReviewsForArticleDoi => (articleDoi) => pipe(
  getAllEvents,
  T.map(flow(
    RA.filter(isGroupEvaluatedArticleEvent),
    RA.filter((event) => eqDoi.equals(event.articleId, articleDoi)),
    RA.map((event) => ({
      reviewId: event.reviewId,
      groupId: event.groupId,
      occurredAt: event.date,
    })),
  )),
);
