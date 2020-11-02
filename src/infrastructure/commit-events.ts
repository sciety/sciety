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

export default (
  inMemoryEvents: Array<DomainEvent>,
  pool: Pool,
  logger: Logger,
): CommitEvents => (
  async (events) => {
    for (const event of events) {
      // TODO: start persisting these events
      if (event.type !== 'UserFoundReviewHelpful' && event.type !== 'UserRevokedFindingReviewHelpful') {
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
