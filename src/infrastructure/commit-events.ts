import { Pool } from 'pg';
import { Logger } from './logger';
import { DomainEvent, RuntimeGeneratedEvent } from '../types/domain-events';
import EditorialCommunityId from '../types/editorial-community-id';

export type CommitEvents = (event: ReadonlyArray<RuntimeGeneratedEvent>) => Promise<void>;

const replacer = (key: string, value: unknown): unknown => {
  if (['date', 'id', 'type'].includes(key)) {
    return undefined;
  }

  if (value instanceof EditorialCommunityId) {
    return value.value;
  }

  return value;
};

// TODO: should be all RuntimeGeneratedEvents
const persistedEventsWhiteList: ReadonlyArray<string> = [
  'UserFollowedEditorialCommunity',
  'UserUnfollowedEditorialCommunity',
];

export default (
  inMemoryEvents: Array<DomainEvent>,
  pool: Pool,
  logger: Logger,
): CommitEvents => (
  async (events) => {
    for (const event of events) {
      if (persistedEventsWhiteList.includes(event.type)) {
        await pool.query(
          'INSERT INTO events (id, type, date, payload) VALUES ($1, $2, $3, $4);',
          [event.id, event.type, event.date, JSON.stringify(event, replacer)],
        );
      }

      inMemoryEvents.push(event);

      logger('info', 'Event committed', { event });
    }
  }
);
