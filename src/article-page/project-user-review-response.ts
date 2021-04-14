import * as O from 'fp-ts/Option';
import * as RT from 'fp-ts/ReaderTask';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TO from 'fp-ts/TaskOption';
import { flow, pipe } from 'fp-ts/function';
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
  T.map(flow(
    RA.filter((event): event is
      UserFoundReviewHelpfulEvent |
      UserRevokedFindingReviewHelpfulEvent |
      UserRevokedFindingReviewNotHelpfulEvent |
      UserFoundReviewNotHelpfulEvent => (
      event.type === 'UserFoundReviewHelpful'
      || event.type === 'UserRevokedFindingReviewHelpful'
      || event.type === 'UserFoundReviewNotHelpful'
      || event.type === 'UserRevokedFindingReviewNotHelpful'
    )),
    RA.filter((event) => event.userId === userId),
    RA.filter((event) => ReviewId.equals(event.reviewId, reviewId)),
    RNEA.fromReadonlyArray,
    O.chain(flow(
      RNEA.last,
      (mostRecentEvent) => {
        switch (mostRecentEvent.type) {
          case 'UserFoundReviewHelpful':
            return O.some('helpful' as const);
          case 'UserFoundReviewNotHelpful':
            return O.some('not-helpful' as const);
          default:
            return O.none;
        }
      },
    )),
  )),
);

type ProjectUserReviewResponse = (
  reviewId: ReviewId.ReviewId,
  userId: O.Option<UserId>,
) => RT.ReaderTask<GetEvents, O.Option<'helpful' | 'not-helpful'>>;

export const projectUserReviewResponse: ProjectUserReviewResponse = (reviewId, userId) => (getEvents) => pipe(
  userId,
  O.fold(
    () => TO.none,
    (u) => projectResponse(getEvents)(reviewId, u),
  ),
);
