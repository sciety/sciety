import { Pool } from 'pg';
import { Logger } from './logger';
import { DomainEvent, UserFollowedEditorialCommunityEvent, UserUnfollowedEditorialCommunityEvent } from '../types/domain-events';
import EditorialCommunityId from '../types/editorial-community-id';

type RuntimeGeneratedEvent = UserFollowedEditorialCommunityEvent | UserUnfollowedEditorialCommunityEvent;
export type CommitEvent = (event: RuntimeGeneratedEvent) => Promise<void>;

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
  events: Array<DomainEvent>,
  pool: Pool,
  logger: Logger,
): CommitEvent => (
  async (event) => {
    await pool.query(
      'INSERT INTO events (id, type, date, payload) VALUES ($1, $2, $3, $4);',
      [event.id, event.type, event.date.toISOString(), JSON.stringify(event, replacer)],
    );

    events.push(event);

    logger('info', 'Event committed', { event });
  }
);
