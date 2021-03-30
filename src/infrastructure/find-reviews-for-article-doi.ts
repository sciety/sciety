import * as RT from 'fp-ts/ReaderTask';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { flow } from 'fp-ts/function';
import { Doi, eqDoi } from '../types/doi';
import { DomainEvent, isEditorialCommunityReviewedArticleEvent } from '../types/domain-events';
import { GroupId } from '../types/group-id';
import { ReviewId } from '../types/review-id';

type FindReviewsForArticleDoi = (articleDoi: Doi) => RT.ReaderTask<GetAllEvents, ReadonlyArray<{
  reviewId: ReviewId,
  groupId: GroupId,
  occurredAt: Date,
}>>;

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

export const findReviewsForArticleDoi: FindReviewsForArticleDoi = (articleDoi) => (
  T.map(flow(
    RA.filter(isEditorialCommunityReviewedArticleEvent),
    RA.filter((event) => eqDoi.equals(event.articleId, articleDoi)),
    RA.map((event) => ({
      reviewId: event.reviewId,
      groupId: event.editorialCommunityId,
      occurredAt: event.date,
    })),
  ))
);
