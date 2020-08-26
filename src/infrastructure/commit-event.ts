import { Pool } from 'pg';
import { Logger } from './logger';
import { DomainEvent, UserFollowedEditorialCommunityEvent, UserUnfollowedEditorialCommunityEvent } from '../types/domain-events';
import EditorialCommunityId from '../types/editorial-community-id';

type RuntimeGeneratedEvent = UserFollowedEditorialCommunityEvent | UserUnfollowedEditorialCommunityEvent;
export type CommitEvent = (event: RuntimeGeneratedEvent) => Promise<void>;

const replacer = (key: string, value: unknown): unknown => {
  if (['date', 'type'].includes(key)) {
    return undefined;
  }

  if (value instanceof EditorialCommunityId) {
    return value.value;
  }

  return value;
};

export default (
  events: Array<DomainEvent>,
  pool: Pool,
  logger: Logger,
): CommitEvent => (
  async (event) => {
    try {
      await pool.query('CREATE TABLE IF NOT EXISTS events (type varchar, date timestamp, payload jsonb);');
      const insertionResult = await pool.query(
        'INSERT INTO events (type, date, payload) VALUES ($1, $2, $3) RETURNING *;',
        [event.type, event.date.toISOString(), JSON.stringify(event, replacer)],
      );
      logger('debug', 'Insertion result', { result: insertionResult.rows });
    } catch (error) {
      logger('debug', 'Could not insert in the database', { error });
    }
    events.push(event);
  }
);
