import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DomainEvent, isEvaluationRecordedEvent } from '../../domain-events';
import { Doi, eqDoi } from '../../types/doi';
import { GroupId } from '../../types/group-id';
import { ReviewId } from '../../types/review-id';

type GetEvaluationsForDoi = (articleDoi: Doi) => (events: ReadonlyArray<DomainEvent>) => ReadonlyArray<{
  reviewId: ReviewId,
  groupId: GroupId,
  recordedAt: Date,
  publishedAt: Date,
  authors: ReadonlyArray<string>,
}>;

export const getEvaluationsForDoi: GetEvaluationsForDoi = (articleDoi) => (events) => pipe(
  events,
  RA.filter(isEvaluationRecordedEvent),
  RA.filter((event) => eqDoi.equals(event.articleId, articleDoi)),
  RA.map((event) => ({
    reviewId: event.evaluationLocator,
    groupId: event.groupId,
    recordedAt: event.date,
    publishedAt: event.publishedAt,
    authors: event.authors,
  })),
);
