import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { constant, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { GetTwitterResponse } from './get-twitter-response';
import * as DE from '../types/data-error';
import { UserId } from '../types/user-id';

type UserDetails = {
  avatarUrl: string,
  displayName: string,
  handle: string,
};

type GetTwitterUserDetailsBatch = (
  getTwitterResponse: GetTwitterResponse
) => (
  userIds: ReadonlyArray<UserId>
) => TE.TaskEither<DE.DataError, ReadonlyArray<UserDetails>>;

const codec = t.type({
  data: t.array(t.type({
    username: t.string,
    name: t.string,
  })),
});

// ts-unused-exports:disable-next-line
export const getTwitterUserDetailsBatch: GetTwitterUserDetailsBatch = (
  getTwitterResponse,
) => (
  userIds,
) => pipe(
  userIds,
  RA.match(
    constant(TE.right([])),
    () => pipe(
      TE.tryCatch(async () => getTwitterResponse(`https://api.twitter.com/2/users?ids=${userIds.join(',')}`), E.toError),
      TE.chainEitherKW(codec.decode),
      TE.map((response) => response.data),
      TE.bimap(
        () => DE.unavailable,
        RA.map((item) => ({
          avatarUrl: '',
          displayName: item.name,
          handle: item.username,
        })),
      ),
    ),
  ),
);
