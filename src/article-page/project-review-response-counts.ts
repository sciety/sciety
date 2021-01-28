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

const onNewEvent = (acc: {[key:string]: { helpfulCount: number, notHelpfulCount: number}}, newEvent: DomainEvent) => {
  // TODO: terrible cloning to avoid updating acc in place, use an immutable data structure instead
  const newAcc = {...acc};
  if (
    newEvent.type === 'UserFoundReviewHelpful' 
    || newEvent.type === 'UserRevokedFindingReviewHelpful'
    || newEvent.type === 'UserFoundReviewNotHelpful'
    || newEvent.type === 'UserRevokedFindingReviewNotHelpful'
  ) {
    const key = newEvent.reviewId.toString();
    if (!(key in acc)) {
      newAcc[key] = { helpfulCount: 0, notHelpfulCount: 0};
    }
    // TODO: switch rather than if
    if (newEvent.type === 'UserFoundReviewHelpful') {
      newAcc[key].helpfulCount = newAcc[key].helpfulCount + 1;
    }
    if (newEvent.type === 'UserRevokedFindingReviewHelpful') {
      newAcc[key].helpfulCount = newAcc[key].helpfulCount - 1;
    }
    if (newEvent.type === 'UserFoundReviewNotHelpful') {
      newAcc[key].notHelpfulCount = newAcc[key].notHelpfulCount + 1;
    }
    if (newEvent.type === 'UserRevokedFindingReviewNotHelpful') {
      newAcc[key].notHelpfulCount = newAcc[key].notHelpfulCount - 1;
    }
  }
  return newAcc;
};

export const createProjectReviewResponseCounts = (getEvents: GetEvents): CountReviewResponses => {
  const projectionState = pipe(
    getEvents,
    // TODO: understand what RA.foldMap does
    T.map(RA.reduce({}, onNewEvent))
  );
  return (reviewId) => {
    // TODO: how to mutably-update the projection state on a new event?
    // TODO: multiple invocations modify the result, doubling the count
    return pipe(
      projectionState,
      T.map((acc) => acc[reviewId.toString()] ?? { helpfulCount: 0, notHelpfulCount: 0}),
    );
  }
};
