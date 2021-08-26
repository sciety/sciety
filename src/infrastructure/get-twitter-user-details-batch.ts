import axios from 'axios';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { constant, flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { GetTwitterResponse } from './get-twitter-response';
import { Logger } from './logger';
import * as DE from '../types/data-error';
import { toUserId, UserId } from '../types/user-id';

type UserDetails = {
  userId: UserId,
  avatarUrl: string,
  displayName: string,
  handle: string,
};

type GetTwitterUserDetailsBatch = (
  getTwitterResponse: GetTwitterResponse,
  logger: Logger,
) => (
  userIds: ReadonlyArray<UserId>
) => TE.TaskEither<DE.DataError, ReadonlyArray<UserDetails>>;

const codec = t.type({
  data: tt.optionFromNullable(t.array(t.type({
    id: t.string,
    username: t.string,
    name: t.string,
    profile_image_url: t.string,
  }))),
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
      getTwitterResponse(`https://api.twitter.com/2/users?ids=${userIds.join(',')}&user.fields=profile_image_url`),
      TE.mapLeft((error) => (axios.isAxiosError(error) && error.response?.status === 400
        ? DE.notFound
        : DE.unavailable)),
      T.map(E.chainW(flow(
        codec.decode,
        E.mapLeft(() => DE.unavailable),
      ))),
      TE.map(({ data }) => pipe(
        data,
        O.fold(
          () => [],
          RA.map((item) => ({
            userId: toUserId(item.id),
            avatarUrl: item.profile_image_url,
            displayName: item.name,
            handle: item.username,
          })),
        ),
      )),
    ),
  ),
);
