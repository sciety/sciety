import { Json, JsonRecord } from 'io-ts-types';
import { Pool } from 'pg';
import { Logger } from './logger';
import { Doi } from '../types/doi';
import { DomainEvent } from '../types/domain-events';
import { GroupId } from '../types/editorial-community-id';
import { EventId } from '../types/event-id';
import { toReviewId } from '../types/review-id';
import { toUserId } from '../types/user-id';

type EventRow = {
  id: EventId,
  type: string,
  date: Date,
  payload: Json,
};

const isObject = (value: Json): value is JsonRecord => (
  value !== null && typeof value === 'object' && !Array.isArray(value)
);

const ensureString = (value: Json): string => {
  if (!(typeof value === 'string')) {
    throw new Error(`Expected a string, got ${typeof value}`);
  }

  return value;
};

export const getEventsFromDatabase = async (pool: Pool, logger: Logger): Promise<Array<DomainEvent>> => {
  const { rows } = await pool.query<EventRow>('SELECT * FROM events');

  logger('debug', 'Reading events from database', { count: rows.length });

  return rows.map(({
    id, type, date, payload,
  }) => {
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
          editorialCommunityId: new GroupId(ensureString(payload.editorialCommunityId)),
        };
      }
      case 'UserUnfollowedEditorialCommunity': {
        return {
          id,
          type,
          date,
          userId: toUserId(ensureString(payload.userId)),
          editorialCommunityId: new GroupId(ensureString(payload.editorialCommunityId)),
        };
      }
      case 'UserFoundReviewHelpful':
      case 'UserFoundReviewNotHelpful':
      case 'UserRevokedFindingReviewHelpful':
      case 'UserRevokedFindingReviewNotHelpful': {
        return {
          id,
          type,
          date,
          reviewId: toReviewId(ensureString(payload.reviewId)),
          userId: toUserId(ensureString(payload.userId)),
        };
      }
      case 'UserSavedArticle': {
        return {
          id,
          type,
          date,
          userId: toUserId(ensureString(payload.userId)),
          articleId: new Doi(ensureString(payload.articleId)),
        };
      }
      default: {
        throw new Error(`Unknown event type ${type}`);
      }
    }
  });
};
