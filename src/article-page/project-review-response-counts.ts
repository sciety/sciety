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
  const onNewEvent = (acc: {[key:string]: { helpfulCount: number, notHelpfulCount: number}}, newEvent: DomainEvent) => {
    if (
      newEvent.type === 'UserFoundReviewHelpful' 
      || newEvent.type === 'UserRevokedFindingReviewHelpful'
      || newEvent.type === 'UserFoundReviewNotHelpful'
      || newEvent.type === 'UserRevokedFindingReviewNotHelpful'
    ) {
      const key = newEvent.reviewId.toString();
      if (!(key in acc)) {
        acc[key] = { helpfulCount: 0, notHelpfulCount: 0};
      }
      // TODO: switch rather than if
      if (newEvent.type === 'UserFoundReviewHelpful') {
        acc[key].helpfulCount = acc[key].helpfulCount + 1;
      }
      if (newEvent.type === 'UserRevokedFindingReviewHelpful') {
        acc[key].helpfulCount = acc[key].helpfulCount - 1;
      }
      if (newEvent.type === 'UserFoundReviewNotHelpful') {
        acc[key].notHelpfulCount = acc[key].notHelpfulCount + 1;
      }
      if (newEvent.type === 'UserRevokedFindingReviewNotHelpful') {
        acc[key].notHelpfulCount = acc[key].notHelpfulCount - 1;
      }
    }
    return acc;
  };
  const projectionState = pipe(
    getEvents,
    // TODO: understand what RA.foldMap does
    T.map(RA.reduce({}, onNewEvent))
  );
  // TODO: how to mutably-update the projection state on a new event?
  return pipe(
    projectionState,
    T.map((acc) => acc[reviewId.toString()] ?? { helpfulCount: 0, notHelpfulCount: 0}),
  );
};
