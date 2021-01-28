import * as T from 'fp-ts/lib/Task';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import { pipe } from 'fp-ts/lib/function';
import { CountReviewResponses } from './render-review-responses';
import {
  DomainEvent,
} from '../types/domain-events';

type GetEvents = T.Task<ReadonlyArray<DomainEvent>>;

type ProjectionState = {[reviewIdAsKey:string]: { helpfulCount: number, notHelpfulCount: number}};

type OnNewEvent = (currentState: ProjectionState, newEvent: DomainEvent) => ProjectionState;

const onNewEvent: OnNewEvent = (currentState, newEvent) => {
  // TODO: terrible cloning to avoid updating acc in place, use an immutable data structure instead
  const newState = {...currentState};
  if (
    newEvent.type === 'UserFoundReviewHelpful' 
    || newEvent.type === 'UserRevokedFindingReviewHelpful'
    || newEvent.type === 'UserFoundReviewNotHelpful'
    || newEvent.type === 'UserRevokedFindingReviewNotHelpful'
  ) {
    const key = newEvent.reviewId.toString();
    if (!(key in currentState)) {
      newState[key] = { helpfulCount: 0, notHelpfulCount: 0};
    }
    // TODO: switch rather than if
    if (newEvent.type === 'UserFoundReviewHelpful') {
      newState[key].helpfulCount = newState[key].helpfulCount + 1;
    }
    if (newEvent.type === 'UserRevokedFindingReviewHelpful') {
      newState[key].helpfulCount = newState[key].helpfulCount - 1;
    }
    if (newEvent.type === 'UserFoundReviewNotHelpful') {
      newState[key].notHelpfulCount = newState[key].notHelpfulCount + 1;
    }
    if (newEvent.type === 'UserRevokedFindingReviewNotHelpful') {
      newState[key].notHelpfulCount = newState[key].notHelpfulCount - 1;
    }
  }
  return newState;
};

export const createProjectReviewResponseCounts = (getEvents: GetEvents): CountReviewResponses => {
  const projectionState = pipe(
    getEvents,
    // TODO: understand what RA.foldMap does
    T.map(RA.reduce({}, onNewEvent))
  );
  return (reviewId) => {
    // TODO: how to mutably-update the projection state on a new event?
    return pipe(
      projectionState,
      T.map((currentState) => currentState[reviewId.toString()] ?? { helpfulCount: 0, notHelpfulCount: 0}),
    );
  }
};
