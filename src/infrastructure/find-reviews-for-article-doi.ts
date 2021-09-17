import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { DomainEvent, isGroupEvaluatedArticleEvent } from '../domain-events';
import * as DE from '../types/data-error';
import { Doi, eqDoi } from '../types/doi';
import { GroupId } from '../types/group-id';
import { ReviewId } from '../types/review-id';

export type FindReviewsForArticleDoi = (articleDoi: Doi) => TE.TaskEither<DE.DataError, ReadonlyArray<{
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
  TE.rightTask,
);
