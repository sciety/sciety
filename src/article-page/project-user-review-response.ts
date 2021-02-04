import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { GetUserReviewResponse } from './render-review-responses';
import {
  DomainEvent,
  UserFoundReviewHelpfulEvent,
  UserFoundReviewNotHelpfulEvent,
  UserRevokedFindingReviewHelpfulEvent,
  UserRevokedFindingReviewNotHelpfulEvent,
} from '../types/domain-events';
import { ReviewId } from '../types/review-id';
import { UserId } from '../types/user-id';

type GetEvents = T.Task<ReadonlyArray<DomainEvent>>;

const projectResponse = (getEvents: GetEvents) => (reviewId: ReviewId, userId: UserId): T.Task<O.Option<'helpful' | 'not-helpful'>> => pipe(
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
  T.map(RA.filter(((event) => event.reviewId.toString() === reviewId.toString()))),
  T.map(O.fromPredicate((events) => events.length > 0)),
  T.map(O.chain((ofInterest) => {
    const mostRecentEventType = ofInterest[ofInterest.length - 1].type;
    switch (mostRecentEventType) {
      case 'UserFoundReviewHelpful':
        return O.some('helpful');
      case 'UserFoundReviewNotHelpful':
        return O.some('not-helpful');
      default:
        return O.none;
    }
  })),
);

export const createProjectUserReviewResponse = (getEvents: GetEvents): GetUserReviewResponse => (
  (reviewId, userId) => pipe(
    userId,
    O.fold(
      () => T.of(O.none),
      (u) => projectResponse(getEvents)(reviewId, u),
    ),
  )
);
