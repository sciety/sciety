import * as RA from 'fp-ts/lib/ReadonlyArray';
import * as T from 'fp-ts/lib/Task';
import { constVoid, pipe } from 'fp-ts/lib/function';
import { Pool } from 'pg';
import { Logger } from './logger';
import { Doi } from '../types/doi';
import { DomainEvent, RuntimeGeneratedEvent } from '../types/domain-events';
import { EditorialCommunityId } from '../types/editorial-community-id';
import { HypothesisAnnotationId } from '../types/hypothesis-annotation-id';

// TODO: should return a TaskEither
export type CommitEvents = (event: ReadonlyArray<RuntimeGeneratedEvent>) => T.Task<void>;

const replacer = (key: string, value: unknown): unknown => {
  if (['date', 'id', 'type'].includes(key)) {
    return undefined;
  }

  if (value instanceof EditorialCommunityId) {
    return value.value;
  }

  if (value instanceof HypothesisAnnotationId || value instanceof Doi) {
    return value.toString();
  }

  return value;
};

// TODO: should be all RuntimeGeneratedEvents
const persistedEventsWhiteList: ReadonlyArray<RuntimeGeneratedEvent['type']> = [
  'UserFollowedEditorialCommunity',
  'UserUnfollowedEditorialCommunity',
  'UserFoundReviewHelpful',
  'UserFoundReviewNotHelpful',
  'UserRevokedFindingReviewHelpful',
  'UserRevokedFindingReviewNotHelpful',
  'UserSavedArticle',
];

export default (
  inMemoryEvents: Array<DomainEvent>,
  pool: Pool,
  logger: Logger,
): CommitEvents => (
  (events) => pipe(
    events,
    RA.map((event) => async () => {
      if (persistedEventsWhiteList.includes(event.type)) {
        await pool.query(
          'INSERT INTO events (id, type, date, payload) VALUES ($1, $2, $3, $4);',
          [event.id, event.type, event.date, JSON.stringify(event, replacer)],
        );
      }

      inMemoryEvents.push(event);

      logger('info', 'Event committed', { event });
    }),
    T.sequenceArray,
    T.map(constVoid),
  )
);
