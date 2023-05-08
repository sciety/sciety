import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { flow, pipe } from 'fp-ts/function';
import {
  DomainEvent,
  UserFoundReviewHelpfulEvent,
  UserFoundReviewNotHelpfulEvent,
  UserRevokedFindingReviewHelpfulEvent,
  UserRevokedFindingReviewNotHelpfulEvent,
} from '../../../domain-events';
import * as RI from '../../../types/evaluation-locator';
import { UserId } from '../../../types/user-id';

const projectResponse = (events: ReadonlyArray<DomainEvent>, reviewId: RI.EvaluationLocator, userId: UserId) => pipe(
  events,
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
);

type ProjectUserReviewResponse = (
  reviewId: RI.EvaluationLocator,
  userId: O.Option<UserId>,
) => (
  events: ReadonlyArray<DomainEvent>,
) => O.Option<'helpful' | 'not-helpful'>;

export const projectUserReviewResponse: ProjectUserReviewResponse = (reviewId, userId) => (events) => pipe(
  userId,
  O.chain((u) => projectResponse(events, reviewId, u)),
);
