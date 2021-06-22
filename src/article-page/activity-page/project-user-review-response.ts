import * as O from 'fp-ts/Option';
import * as RT from 'fp-ts/ReaderTask';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TO from 'fp-ts/TaskOption';
import { flow, pipe } from 'fp-ts/function';
import { match } from 'ts-pattern';
import {
  DomainEvent,
  UserFoundReviewHelpfulEvent,
  UserFoundReviewNotHelpfulEvent,
  UserRevokedFindingReviewHelpfulEvent,
  UserRevokedFindingReviewNotHelpfulEvent,
} from '../../types/domain-events';
import * as RI from '../../types/review-id';
import { UserId } from '../../types/user-id';

type GetEvents = T.Task<ReadonlyArray<DomainEvent>>;

const projectResponse = (getEvents: GetEvents) => (reviewId: RI.ReviewId, userId: UserId) => pipe(
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
    RA.filter((event) => RI.equals(event.reviewId, reviewId)),
    RNEA.fromReadonlyArray,
    O.chain(flow(
      RNEA.last,
      (mostRecentEvent) => match(mostRecentEvent.type)
        .with('UserFoundReviewHelpful', () => O.some('helpful' as const))
        .with('UserFoundReviewNotHelpful', () => O.some('not-helpful' as const))
        .otherwise(() => O.none),
    )),
  )),
);

type ProjectUserReviewResponse = (
  reviewId: RI.ReviewId,
  userId: O.Option<UserId>,
) => RT.ReaderTask<GetEvents, O.Option<'helpful' | 'not-helpful'>>;

export const projectUserReviewResponse: ProjectUserReviewResponse = (reviewId, userId) => (getEvents) => pipe(
  userId,
  O.fold(
    () => TO.none,
    (u) => projectResponse(getEvents)(reviewId, u),
  ),
);
