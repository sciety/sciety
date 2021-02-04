import * as O from 'fp-ts/Option';
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

const projectResponse = (getEvents: GetEvents) => async (reviewId: ReviewId, userId: UserId): Promise<O.Option<'helpful' | 'not-helpful'>> => {
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
    return O.none;
  }

  const mostRecentEventType = ofInterest[ofInterest.length - 1].type;
  switch (mostRecentEventType) {
    case 'UserFoundReviewHelpful':
      return O.some('helpful');
    case 'UserFoundReviewNotHelpful':
      return O.some('not-helpful');
    default:
      return O.none;
  }
};

export const createProjectUserReviewResponse = (getEvents: GetEvents): GetUserReviewResponse => (
  async (reviewId, userId) => pipe(
    userId,
    O.fold(
      async () => O.none,
      async (u) => projectResponse(getEvents)(reviewId, u),
    ),
  )
);
