import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as PR from 'io-ts/PathReporter';
import { GetTwitterResponse } from './get-twitter-response';
import { Logger } from './logger';
import * as DE from '../types/data-error';
import { toUserId, UserId } from '../types/user-id';

export type GetTwitterUserId = (handle: string) => TE.TaskEither<DE.DataError, UserId>;

const dataTwitterResponse = t.type({
  data: t.type({
    id: t.string,
    name: t.string,
    username: t.string,
  }),
});

const errorsTwitterResponse = t.type({
  errors: t.UnknownArray,
});

const twitterResponse = t.union([
  dataTwitterResponse,
  errorsTwitterResponse,
]);

export const getTwitterUserId = (
  getTwitterResponse: GetTwitterResponse,
  logger: Logger,
): GetTwitterUserId => (handle) => pipe(
  getTwitterResponse(`https://api.twitter.com/2/users/by/username/${handle}`),
  TE.mapLeft((error) => {
    logger('error', 'Unable to get Twitter response', { error });
    return DE.unavailable;
  }),
  T.map(E.chain((response) => pipe(
    response,
    twitterResponse.decode,
    E.mapLeft(PR.failure),
    E.mapLeft((errors) => {
      logger('error', 'Unable to parse Twitter response', { errors, response });
      return DE.unavailable;
    }),
  ))),
  TE.filterOrElseW(
    dataTwitterResponse.is,
    (response) => {
      logger('error', 'Error in Twitter response', { response });
      return DE.notFound;
    },
  ),
  TE.map((json) => json.data.id),
  TE.map(toUserId),
);
