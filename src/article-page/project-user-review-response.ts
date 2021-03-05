import * as O from 'fp-ts/Option';
import * as RT from 'fp-ts/ReaderTask';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import {
  DomainEvent,
  UserFoundReviewHelpfulEvent,
  UserFoundReviewNotHelpfulEvent,
  UserRevokedFindingReviewHelpfulEvent,
  UserRevokedFindingReviewNotHelpfulEvent,
} from '../types/domain-events';
import * as ReviewId from '../types/review-id';
import { UserId } from '../types/user-id';

type GetEvents = T.Task<ReadonlyArray<DomainEvent>>;

const projectResponse = (getEvents: GetEvents) => (reviewId: ReviewId.ReviewId, userId: UserId) => pipe(
  getEvents,
  T.map(RA.filter((event): event is
    UserFoundReviewHelpfulEvent |
    UserRevokedFindingReviewHelpfulEvent |
    UserRevokedFindingReviewNotHelpfulEvent |
    UserFoundReviewNotHelpfulEvent => (
    event.type === 'UserFoundReviewHelpful'
    || event.type === 'UserRevokedFindingReviewHelpful'
    || event.type === 'UserFoundReviewNotHelpful'
    || event.type === 'UserRevokedFindingReviewNotHelpful'
  ))),
  T.map(RA.filter((event) => event.userId === userId)),
  T.map(RA.filter((event) => ReviewId.equals(event.reviewId, reviewId))),
  T.map(RNEA.fromReadonlyArray),
  T.map(O.chain((ofInterest) => {
    const mostRecentEventType = ofInterest[ofInterest.length - 1].type;
    switch (mostRecentEventType) {
      case 'UserFoundReviewHelpful':
        return O.some('helpful' as const);
      case 'UserFoundReviewNotHelpful':
        return O.some('not-helpful' as const);
      default:
        return O.none;
    }
  })),
);

type ProjectUserReviewResponse = (
  reviewId: ReviewId.ReviewId,
  userId: O.Option<UserId>,
) => RT.ReaderTask<GetEvents, O.Option<'helpful' | 'not-helpful'>>;

export const projectUserReviewResponse: ProjectUserReviewResponse = (reviewId, userId) => (getEvents) => pipe(
  userId,
  O.fold(
    () => T.of(O.none),
    (u) => projectResponse(getEvents)(reviewId, u),
  ),
);
