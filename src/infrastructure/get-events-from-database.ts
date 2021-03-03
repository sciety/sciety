import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { flow, identity, pipe } from 'fp-ts/function';
import { Json, JsonRecord } from 'io-ts-types';
import * as PR from 'io-ts/PathReporter';
import { Pool } from 'pg';
import { databaseEvent } from './codecs/DatabaseEvent';
import { Logger } from './logger';
import { Doi } from '../types/doi';
import { DomainEvent } from '../types/domain-events';
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

export const getEventsFromDatabase = (
  pool: Pool,
  logger: Logger,
): TE.TaskEither<unknown, ReadonlyArray<DomainEvent>> => pipe(
  TE.tryCatch(async () => pool.query<EventRow>('SELECT * FROM events'), identity),
  TE.map((result) => result.rows),
  TE.chainFirstW(flow(
    (rows) => logger('debug', 'Reading events from database', { count: rows.length }),
    TE.right,
  )),
  TE.chainW(TE.traverseArray((row) => {
    const {
      id, type, date, payload,
    } = row;
    if (!isObject(payload)) {
      return TE.left(new Error('Payload is not an object'));
    }
    switch (type) {
      case 'UserFollowedEditorialCommunity':
      case 'UserUnfollowedEditorialCommunity': {
        return pipe(
          { ...row, date: row.date.toString() }, // TODO return a string from the database
          databaseEvent.decode,
          TE.fromEither,
          TE.bimap(
            (error) => new Error(PR.failure(error).join('\n')),
            (event) => ({ ...event, ...event.payload }),
          ),
        );
      }
      case 'UserFoundReviewHelpful':
      case 'UserFoundReviewNotHelpful':
      case 'UserRevokedFindingReviewHelpful':
      case 'UserRevokedFindingReviewNotHelpful': {
        return TE.tryCatch(async () => ({
          id,
          type,
          date,
          reviewId: toReviewId(ensureString(payload.reviewId)),
          userId: toUserId(ensureString(payload.userId)),
        }), E.toError);
      }
      case 'UserSavedArticle': {
        return TE.tryCatch(async () => ({
          id,
          type,
          date,
          userId: toUserId(ensureString(payload.userId)),
          articleId: new Doi(ensureString(payload.articleId)),
        }), E.toError);
      }
      default: {
        return TE.left(new Error(`Unknown event type ${type}`));
      }
    }
  })),
);
