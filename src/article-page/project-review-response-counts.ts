import { respondNotHelpful } from './../respond/respond-not-helpful-command';
import * as T from 'fp-ts/lib/Task';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import { pipe } from 'fp-ts/lib/function';
import { CountReviewResponses } from './render-review-responses';
import {
  DomainEvent,
  UserFoundReviewHelpfulEvent, UserFoundReviewNotHelpfulEvent,
  UserRevokedFindingReviewHelpfulEvent,
  UserRevokedFindingReviewNotHelpfulEvent,
} from '../types/domain-events';
import { ReviewId } from '../types/review-id';

type GetEvents = T.Task<ReadonlyArray<DomainEvent>>;

const projection = (reviewId: ReviewId) => (events: ReadonlyArray<DomainEvent>) => {
  const helpfulCount = events
    .filter((event): event is UserFoundReviewHelpfulEvent | UserRevokedFindingReviewHelpfulEvent => (
      event.type === 'UserFoundReviewHelpful' || event.type === 'UserRevokedFindingReviewHelpful'
    ))
    .filter((event) => event.reviewId.toString() === reviewId.toString())
    .reduce((count, event) => (
      event.type === 'UserFoundReviewHelpful' ? count + 1 : count - 1
    ), 0);

  const notHelpfulCount = events
    .filter((event): event is UserFoundReviewNotHelpfulEvent | UserRevokedFindingReviewNotHelpfulEvent => (
      event.type === 'UserFoundReviewNotHelpful' || event.type === 'UserRevokedFindingReviewNotHelpful'
    ))
    .filter((event) => event.reviewId.toString() === reviewId.toString())
    .reduce((count, event) => (
      event.type === 'UserFoundReviewNotHelpful' ? count + 1 : count - 1
    ), 0);

  return { helpfulCount, notHelpfulCount };
};

export const createProjectReviewResponseCounts = (getEvents: GetEvents): CountReviewResponses => (reviewId) => {
  // TODO: rename acc
  const onNewEvent = (acc: {[key:string]: number}, newEvent: DomainEvent) => {
    if (newEvent.type === 'UserFoundReviewHelpful' || newEvent.type === 'UserRevokedFindingReviewHelpful') {
      const key = newEvent.reviewId.toString();
      if (!(key in acc)) {
        acc[key] = 0;
      }
      if (newEvent.type === 'UserFoundReviewHelpful') {
        acc[key] = acc[key] + 1;
      }
      if (newEvent.type === 'UserRevokedFindingReviewHelpful') {
        acc[key] = acc[key] - 1;
      }
    }
    return acc;
  };
  const projectionState = pipe(
    getEvents,
    // TODO: understand what RA.foldMap does
    T.map(RA.reduce({}, onNewEvent))
  );
  projectionState().then((state) => console.log(state));
  // TODO: how to mutably-update the projection state on a new event?
  return pipe(
    projectionState,
    T.map((acc) => ({ helpfulCount: acc[reviewId.toString()] ?? 0, notHelpfulCount: 0})),
  );
};
