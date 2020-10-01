import { Pool } from 'pg';
import { Logger } from './logger';
import {
  DomainEvent,
  UserAcquiredEvent,
  UserFollowedEditorialCommunityEvent,
  UserLoggedInEvent,
  UserUnfollowedEditorialCommunityEvent,
  VisitorTookActionEvent,
} from '../types/domain-events';
import EditorialCommunityId from '../types/editorial-community-id';

type RuntimeGeneratedEvent =
  UserFollowedEditorialCommunityEvent |
  UserUnfollowedEditorialCommunityEvent |
  UserLoggedInEvent |
  UserAcquiredEvent | 
  VisitorTookActionEvent;

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
      await pool.query(
        'INSERT INTO events (id, type, date, payload) VALUES ($1, $2, $3, $4);',
        [event.id, event.type, event.date, JSON.stringify(event, replacer)],
      );

      inMemoryEvents.push(event);

      logger('info', 'Event committed', { event });
    }
  }
);
