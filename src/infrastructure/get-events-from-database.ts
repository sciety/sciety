import { Pool } from 'pg';
import { Logger } from './logger';
import { DomainEvent } from '../types/domain-events';
import EditorialCommunityId from '../types/editorial-community-id';
import { EventId } from '../types/event-id';
import { Json, JsonObject } from '../types/json';
import toUserId from '../types/user-id';

type EventRow = {
  id: EventId,
  type: string,
  date: Date,
  payload: Json,
};

const isObject = (value: Json): value is JsonObject => (
  value !== null && typeof value === 'object' && !Array.isArray(value)
);

const ensureString = (value: Json): string => {
  if (!(typeof value === 'string')) {
    throw new Error(`Expected a string, got ${typeof value}`);
  }

  return value;
};

export default async (pool: Pool, logger: Logger): Promise<Array<DomainEvent>> => {
  const { rows } = await pool.query<EventRow>('SELECT * FROM events');

  logger('debug', 'Reading events from database', { count: rows.length });

  return rows.map(({
    id, type, date, payload,
  }): DomainEvent => {
    if (!isObject(payload)) {
      throw new Error('Payload is not an object');
    }

    switch (type) {
      case 'UserFollowedEditorialCommunity': {
        return {
          id,
          type,
          date,
          userId: toUserId(ensureString(payload.userId)),
          editorialCommunityId: new EditorialCommunityId(ensureString(payload.editorialCommunityId)),
        };
      }
      case 'UserUnfollowedEditorialCommunity': {
        return {
          id,
          type,
          date,
          userId: toUserId(ensureString(payload.userId)),
          editorialCommunityId: new EditorialCommunityId(ensureString(payload.editorialCommunityId)),
        };
      }
      case 'UserLoggedIn': {
        return {
          id,
          type,
          date,
          userId: toUserId(ensureString(payload.userId)),
        };
      }
      case 'UserAcquired': {
        return {
          id,
          type,
          date,
          userId: toUserId(ensureString(payload.userId)),
        };
      }
      default: {
        throw new Error(`Unknown event type ${type}`);
      }
    }
  });
};
