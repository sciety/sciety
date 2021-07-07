import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { GetTwitterResponse } from './get-twitter-response';
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

export const getTwitterUserId = (getTwitterResponse: GetTwitterResponse): GetTwitterUserId => (handle) => pipe(
  TE.tryCatch(
    async () => getTwitterResponse(`https://api.twitter.com/2/users/by/username/${handle}`),
    () => DE.unavailable,
  ),
  T.map(E.chain(flow(
    twitterResponse.decode,
    E.mapLeft(() => DE.unavailable),
  ))),
  TE.filterOrElseW(
    dataTwitterResponse.is,
    () => DE.notFound,
  ),
  TE.map((json) => json.data.id),
  TE.map(toUserId),
);
