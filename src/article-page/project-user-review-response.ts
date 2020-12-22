import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/function';
import { Maybe } from 'true-myth';
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

export type GetEvents = T.Task<ReadonlyArray<DomainEvent>>;

const projectResponse = (getEvents: GetEvents) => async (reviewId: ReviewId, userId: UserId): Promise<Maybe<'helpful' | 'not-helpful'>> => {
  const events = await getEvents();

  // TODO number of filters could be reduced
  const ofInterest = events
    .filter((event): event is
    UserFoundReviewHelpfulEvent |
    UserRevokedFindingReviewHelpfulEvent |
    UserRevokedFindingReviewNotHelpfulEvent |
    UserFoundReviewNotHelpfulEvent => (
      event.type === 'UserFoundReviewHelpful'
      || event.type === 'UserRevokedFindingReviewHelpful'
      || event.type === 'UserFoundReviewNotHelpful'
      || event.type === 'UserRevokedFindingReviewNotHelpful'
    ))
    .filter((event) => event.userId === userId)
    .filter((event) => event.reviewId.toString() === reviewId.toString());

  if (ofInterest.length === 0) {
    return Maybe.nothing();
  }

  const mostRecentEventType = ofInterest[ofInterest.length - 1].type;
  switch (mostRecentEventType) {
    case 'UserFoundReviewHelpful':
      return Maybe.just('helpful');
    case 'UserFoundReviewNotHelpful':
      return Maybe.just('not-helpful');
    default:
      return Maybe.nothing();
  }
};

export default (getEvents: GetEvents): GetUserReviewResponse => (
  async (reviewId, userId) => pipe(
    userId,
    O.fold(
      async () => Maybe.nothing(),
      async (u) => projectResponse(getEvents)(reviewId, u),
    ),
  )
);
