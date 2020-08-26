import { Pool } from 'pg';
import { Logger } from './logger';
import { DomainEvent } from '../types/domain-events';
import EditorialCommunityId from '../types/editorial-community-id';
import { generate } from '../types/event-id';
import { Json, JsonObject } from '../types/json';
import toUserId from '../types/user-id';

type Events = Array<{
  type: string,
  date: Date,
  payload: Json,
}>;

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
  let events: Events;

  try {
    const result = await pool.query('SELECT * FROM events');
    events = result.rows;
  } catch (error) {
    logger('debug', 'Could not query the database', { error });
    return [];
  }

  logger('debug', 'Reading events from database', { events });

  return events.map(({ type, date, payload }): DomainEvent => {
    if (!isObject(payload)) {
      throw new Error('Payload is not an object');
    }

    switch (type) {
      case 'UserFollowedEditorialCommunity': {
        return {
          id: generate(),
          type,
          date,
          userId: toUserId(ensureString(payload.userId)),
          editorialCommunityId: new EditorialCommunityId(ensureString(payload.editorialCommunityId)),
        };
      }
      case 'UserUnfollowedEditorialCommunity': {
        return {
          id: generate(),
          type,
          date,
          userId: toUserId(ensureString(payload.userId)),
          editorialCommunityId: new EditorialCommunityId(ensureString(payload.editorialCommunityId)),
        };
      }
      default: {
        throw new Error(`Unknown event type ${type}`);
      }
    }
  });
};
